from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

import traceback
from datetime import timedelta

from .models import (
    Device, Tag, 
    CurrentIntValue, CurrentFloatValue, CurrentStringValue, CurrentBooleanValue,
    HistoricalIntValue, HistoricalFloatValue, HistoricalStringValue, HistoricalBooleanValue,
)
from . import serializers
from . import choices

def get_device_obj(request, modem=False):
    device_id = request.GET.get('id', None)
    if modem:
        # check modem token
        authorization_token = request.META.get('HTTP_AUTHORIZATION', None)
        key, authorization_token = authorization_token.split(' ')
        obj = Device.objects.filter(id=device_id, connector__token=authorization_token)
        return Device.objects.first() # TODO: delete this row
    else:
        obj = Device.objects.filter(id=device_id)

    if obj.exists():
        return obj.first()
    else:
        return Device.objects.first()



class DeviceParametersView(APIView):
    ''' 
    return device configuration parameters 
    '''
    def get(self, request, *args, **kwargs):
        obj = get_device_obj(request)
        serializer = serializers.DeviceParametersSerializer(obj)
        return Response(serializer.data)


class DeviceTagsParametersView(APIView):
    ''' 
    return tags configuration parameters 
    '''
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        tags = Tag.objects.filter(device=device)
        data = serializers.TagsParametersSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class DeviceTagsCurrentValueView(APIView):
    ''' 
    return current values of device tags 
    '''
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        tags = Tag.objects.filter(device=device)
        data = serializers.TagsValueSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class DeviceTagsHistoricalValueView(APIView):
    ''' 
    return list of historycal values of device tags (value and date/time)
    '''    
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        tags = Tag.objects.filter(device=device)
        tags_data = []
        for t in tags:
            serializer = self.get_historical_values_data(t) 
            tags_data.append({
                'tag_id': t.id, 
                'tag_code': t.code, 
                'tag_name': t.name, 
                'display_on_garaph': t.display_on_graph_by_default,
                'values': serializer.data
            })       
        return Response(tags_data, status=status.HTTP_200_OK)

    def get_historical_values_data(self, tag):
        ''' return tag value depending on tag data type '''  
        some_time_ago = timezone.now()-timezone.timedelta(hours=12)
        values = tag.HistoricalValueModel.objects.filter(tag=tag, add_date__gte=some_time_ago).order_by('add_date')
        selected_values = self._select_values(values)
        serializer = serializers.get_historical_tag_value_serializer(tag)
        return serializer(selected_values, many=True)

    def _select_values(self, values):
        sv = []
        first = True
        for v in values:
            if first:
                first = False
                sv.append(v)
                prev = v
            else:
                if v.add_date > (prev.add_date + timezone.timedelta(minutes=10)):
                    sv.append(v)
                    prev = v
        return sv
        

# view for polling modbus devices
class ModbusDeviceView(APIView):
    ''' 
    through this vie you can get modbus parameters for polling modbus device
    and post tags value data  
    '''
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request, modem=True)
        tags = Tag.objects.filter(device=device)
        data = {
            'device_parametes': serializers.DeviceParametersSerializer(device).data
        }
        tags_list = serializers.TagsParametersSerializer(tags, many=True).data
        data['device_parametes']['tags_count'] = len(tags_list)        
        data['device_parametes']['tags'] = tags_list
        return Response(data)

    def post(self, request, *args, **kwargs):
        try:
            tags = request.data['tags']
            tags_response = []
            for t in tags:
                tag_obj = Tag.objects.get(id=t['id'])
                tag_value = t['value']
                tag_staus = choices.TAG_VALUE_QUALITY_GOOD
                r = self.update_tag_value(tag_obj, tag_value, tag_staus)
                tags_response.append(r)
            response = Response({'tags': tags_response}, status=status.HTTP_201_CREATED)
        except:
            traceback.print_exc()
            response = Response({'Internal error':  traceback.format_exc()})
        return response


    def update_tag_value(self, tag_obj, tag_value, tag_quality):
        ''' write tag value depending on tag data type '''    
        data = {'tag': tag_obj.id, 'value':tag_value, 'quality':tag_quality}

        serializer = serializers.get_current_tag_value_serializer(tag_obj)
        try:
            obj = tag_obj.CurrentValueModel.objects.get(tag=tag_obj)
            v_serializer = serializer(obj, data=data) # update
        except:
            v_serializer = serializer(data=data) # create new

        if v_serializer.is_valid():
            v_serializer.save()
            return v_serializer.data
        else:
            return v_serializer.errors
 
 


