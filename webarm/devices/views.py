import re

from datetime import timedelta
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import (
    Device, Tag,
    CurrentIntValue, CurrentFloatValue, CurrentStringValue, CurrentBooleanValue,
    HistoricalIntValue, HistoricalFloatValue, HistoricalStringValue, HistoricalBooleanValue,
)
from . import serializers


# -----------------------------------------------------------------------------------------------
def get_device_obj(request):
    device_id = request.GET.get('id', None)
    return Device.objects.get(id=device_id)


class DeviceParametersView(APIView):
    ''' return device configuration parameters '''
    def get(self, request, *args, **kwargs):
        obj = get_device_obj(request)
        serializer = serializers.DeviceParametersSerializer(obj)
        return Response(serializer.data)


class DeviceTagsParametersView(APIView):
    ''' return tags configuration parameters '''
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        tags = Tag.objects.filter(device=device)
        data = serializers.TagsParametersSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class DeviceTagsCurrentValueView(APIView):
    ''' return current values of device tags '''
    def get(self, request, *args, **kwargs):
        rq_tags = request.GET.getlist('tags[]', None)

        device = get_device_obj(request)
        if rq_tags:
            # return just selected tags
            tags = Tag.objects.filter(device=device, code__in=rq_tags).order_by('name')
        else:
            # return all tags, if tags[] param does not passed
             tags = Tag.objects.filter(device=device).order_by('name')

        # tags = Tag.objects.filter(device=device).order_by('name')
        data = serializers.TagsValueSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------------------------------
class DeviceTagsHistoricalValueView(APIView):
    ''' return list of historycal values of device tags (value and date/time) '''    
    def get(self, request, *args, **kwargs):
        rq_tags = request.GET.getlist('tags[]', None)
        rq_interval = request.GET.get('interval', None)
        rq_resolution = request.GET.get('resolution', None)

        device = get_device_obj(request)
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


