import re

from datetime import timedelta
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ValidationError

from .models import (
    Device, Tag, ModbusDeviceParameters, ModbusTagParameters,
    CurrentIntValue, CurrentFloatValue, CurrentStringValue, CurrentBooleanValue,
    HistoricalIntValue, HistoricalFloatValue, HistoricalStringValue, HistoricalBooleanValue,
)
from . import serializers
from .utils import get_device_obj_from_request


# -----------------------------------------------------------------------------------------------
class DeviceParametersView(APIView):
    def get(self, request, *args, **kwargs):
        obj = get_device_obj_from_request(request)
        serializer = serializers.DeviceParametersSerializer(obj)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        obj = get_device_obj_from_request(request)   
        serializer = serializers.DeviceParametersSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ModbusDeviceParametersView(APIView):
    def get(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request)
        mdp = ModbusDeviceParameters.objects.get(device=device)
        serializer = serializers.ModbusDeviceParametersSerializer(mdp)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request) 
        try:
            # update parameters
            mdp = ModbusDeviceParameters.objects.get(device=device)
            serializer = serializers.ModbusDeviceParametersSerializer(mdp, data=request.data)
        except ModbusDeviceParameters.DoesNotExist:
            # create parameters
            serializer = serializers.ModbusDeviceParametersSerializer(data=request.data)
 
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)



class DeviceTagsParametersView(APIView):
    def get(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request)
        tags_id = request.GET.getlist('tags[]', None)
        if tags_id:
            # return selected objects
            tags = Tag.objects.filter(id__in=tags_id, device=device).order_by('id')
        else:
            # return all
            tags = Tag.objects.filter(device=device).order_by('id')
        data = serializers.TagsParametersSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


    def post(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request)
        response_data = []
        has_errors = False
        for tag in request.data:
            serializer = None
            if tag.get('id', False) :
                # update
                try:
                    tag_obj = Tag.objects.get(id = tag['id'], device = device)
                    serializer = serializers.TagsParametersSerializer(tag_obj, data=tag)                  
                except Tag.DoesNotExist:
                    # tag with this id does not exist for this device
                    response_data.append( {'id': 'tag with id = %s does not exist for device = %s' %(tag['id'], device)} )   
                    has_errors = True   
            else:
                # create
                tag['device'] = device.id
                serializer = serializers.TagsParametersSerializer(data=tag)

            if serializer:
                if serializer.is_valid():
                    serializer.save()
                    response_data.append(serializer.data)
                else:
                    response_data.append(serializer.errors)
                    has_errors = True

        if has_errors:
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(response_data, status=status.HTTP_200_OK)  


    def delete(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request)
        tags_id = request.GET.getlist('tags[]', None)
        if tags_id:
            # delete all passed events
            tags = Tag.objects.filter(id__in=tags_id, device=device)
            for t in tags:
                t.delete()
        else:
            pass
        return Response({}, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------------------------------
class DeviceTagsCurrentValueView(APIView):
    ''' return current values of device tags '''
    def get(self, request, *args, **kwargs):
        rq_tags = request.GET.getlist('tags[]', None)
        device = get_device_obj_from_request(request)
        if rq_tags:
            # return just selected tags
            tags = Tag.objects.filter(device=device, code__in=rq_tags).order_by('name')
        else:
            # return all tags, if tags[] param does not passed
             tags = Tag.objects.filter(device=device).order_by('name')
        data = serializers.TagsValueSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------------------------------
class DeviceTagsHistoricalValueView(APIView):
    ''' return list of historycal values of device tags (value and date/time) '''    
    def get(self, request, *args, **kwargs):
        rq_tags = request.GET.getlist('tags[]', None)
        rq_interval = request.GET.get('interval', None)
        rq_resolution = request.GET.get('resolution', None)

        device = get_device_obj_from_request(request)
        if rq_tags:
            # return just selected tags
            tags = Tag.objects.filter(device=device, code__in=rq_tags).order_by('name')
        else:
            # return all tags, if tags[] param does not passed
             tags = Tag.objects.filter(device=device).order_by('name')
           
        tags_data = []
        for t in tags:
            serializer = self.get_historical_values_data(t, rq_interval, rq_resolution) 
            tags_data.append({
                'tag_id': t.id, 
                'tag_code': t.code, 
                'tag_name': t.name, 
                'values': serializer.data
            })       
        return Response(tags_data, status=status.HTTP_200_OK)

    def get_historical_values_data(self, tag, interval, resolution):
        ''' return tag value depending on tag data type '''  
        some_time_ago = timezone.now() - self._parse_time_interval(interval)
        values = tag.HistoricalValueModel.objects.filter(tag=tag, add_date__gte=some_time_ago).order_by('add_date')
        selected_values = self._select_values(values, resolution)
        serializer = serializers.get_historical_tag_value_serializer(tag)
        return serializer(selected_values, many=True)

    def _select_values(self, values, resolution):
        sv = []
        first = True
        for v in values:
            if first:
                first = False
                sv.append(v)
                prev = v
            else:
                if v.add_date > (prev.add_date + self._parse_time_resolution(resolution)):
                    sv.append(v)
                    prev = v
        return sv

    def _parse_time_interval(self, interval):
        return self._parse_time_delta(interval)

    def _parse_time_resolution(self, resolution):
        if resolution == 'all':
            return timezone.timedelta(seconds=0)
        else:
            return self._parse_time_delta(resolution)

    def _parse_time_delta(self, interval):
        try: 
            r = re.findall(r'\d+d', interval)[0]
            d = int( r.replace('d', '') ) 
        except IndexError: 
            d = 0

        try: 
            r = re.findall(r'\d+h', interval)[0] 
            h = int( r.replace('h', '') ) 
        except IndexError: 
            h = 0

        try: 
            r = re.findall(r'\d+m', interval)[0] 
            m = int( r.replace('m', '') ) 
        except IndexError: 
            m = 0

        try: 
            r = re.findall(r'\d+s', interval)[0] 
            s = int( r.replace('s', '') ) 
        except IndexError: 
            s = 0

        return timezone.timedelta(days=d , hours=h, minutes=m, seconds=s)


