from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import traceback
from datetime import timedelta

from .models import (
    Device, Tag, 
    CurrentIntValue, CurrentFloatValue, CurrentStringValue, CurrentBooleanValue,
    HistoricalIntValue, HistoricalFloatValue, HistoricalStringValue, HistoricalBooleanValue,
)
from . import serializers
from . import choices


def get_device_obj(request):
    try:
        authorization_token = request.META.get('HTTP_AUTHORIZATION', None)
        key, authorization_token = authorization_token.split(' ')
        device_id = request.META.get('HTTP_DEVICE', None)
        obj = Device.objects.filter(id=device_id, connector__token=authorization_token)
        if obj.exists():
            return obj.first()
        else:
            return Device.objects.first()
    except:
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
                'values': serializer.data
            })         
        return Response(tags_data, status=status.HTTP_200_OK)

    def get_historical_values_data(self, tag):
        ''' return tag value depending on tag data type '''  
        one_h_ago = timezone.now()-timezone.timedelta(hours=1)
        print(one_h_ago)
        if tag.data_type == choices.WEBARM_DATA_TYPE_INT:
            values = HistoricalIntValue.objects.filter(tag=tag, add_date__gte=one_h_ago)
            selected_values = self._select_values(values)
            return serializers.HistoricalIntValuesSerializer(values, many=True)
        elif tag.data_type == choices.WEBARM_DATA_TYPE_FLOAT:
            values = HistoricalFloatValue.objects.filter(tag=tag, add_date__gte=one_h_ago)
            selected_values = self._select_values(values)            
            return serializers.HistoricalFloatValuesSerializer(values, many=True)
        elif tag.data_type == choices.WEBARM_DATA_TYPE_STRING:
            values = HistoricalStringValue.objects.filter(tag=tag, add_date__gte=one_h_ago)
            selected_values = self._select_values(values)            
            return serializers.HistoricalStringValuesSerializer(values, many=True)           
        elif tag.data_type == choices.WEBARM_DATA_TYPE_BOOL:
            values = HistoricalBooleanValue.objects.filter(tag=tag, add_date__gte=one_h_ago)
            selected_values = self._select_values(values)            
            return serializers.HistoricalBooleanValuesSerializer(values, many=True)           
        else:
            return {'Error: data type not supported'} 

    def _select_values(self, values):
        sv = []
        first = True
        for v in values:
            if first:
                first = False
                sv.append(v)
                prev = v
            else:
                if v.add_date > (prev.add_date + timedelta(minutes=1)):
                    sv.append(v)
                    prev = v
        return sv
        

# view for polling modbus devices
class ModbusDeviceView(APIView):
    ''' 
    through this vie you can get modbus parameters for polling modbus device
    and post tags value data  
    '''
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
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
        if tag_obj.data_type == choices.WEBARM_DATA_TYPE_INT:
            try:
                obj = CurrentIntValue.objects.get(tag=tag_obj)
                v_serializer = serializers.IntValueSerializer(obj, data=data) # update
            except:
                v_serializer = serializers.IntValueSerializer(data=data) # create new

        elif tag_obj.data_type == choices.WEBARM_DATA_TYPE_FLOAT:
            try:
                obj = CurrentFloatValue.objects.get(tag=tag_obj)
                v_serializer = serializers.FloatValueSerializer(obj, data=data) # update
            except:
                traceback.print_exc()
                v_serializer = serializers.FloatValueSerializer(data=data) # create new

        elif tag_obj.data_type == choices.WEBARM_DATA_TYPE_STRING:
            try:
                obj = CurrentStringValue.objects.get(tag=tag_obj)
                v_serializer = serializers.StringValueSerializer(obj, data=data) # update
            except:
                v_serializer = serializers.StringValueSerializer(data=data) # create new            

        elif tag_obj.data_type == choices.WEBARM_DATA_TYPE_BOOL:
            try:
                obj = CurrentBooleanValue.objects.get(tag=tag_obj)
                v_serializer = serializers.BooleanValueSerializer(obj, data=data) # update
            except:
                v_serializer = serializers.BooleanValueSerializer(data=data) # create new             
        else:
            return {'Error: data type not supported'}  

        if v_serializer.is_valid():
            v_serializer.save()
            return v_serializer.data
        else:
            return v_serializer.errors
 
 


