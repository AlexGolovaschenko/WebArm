from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import traceback

from .models import (
    Device, Tag, 
    CurrentIntValue, CurrentFloatValue, CurrentStringValue, CurrentBooleanValue,
    HistoricalIntValue, HistoricalFloatValue, HistoricalStringValue, HistoricalBooleanValue,
)
from . import serializers
from . import choices



class DeviceParametersView(APIView):
    def get(self, request, *args, **kwargs):
        obj = Device.objects.first()
        serializer = serializers.DeviceParametersSerializer(obj)
        return Response(serializer.data)


class DeviceTagsParametersView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            device_id = request.GET.device_id
            device = Device.objects.get(id=device_id)
        except:
            device = Device.objects.first()
        tags = Tag.objects.filter(device=device)
        data = serializers.TagsParametersSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        pass    


class DeviceTagsCurrentValueView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            device_id = request.GET.device_id
            device = Device.objects.get(id=device_id)
        except:
            device = Device.objects.first()
        tags = Tag.objects.filter(device=device)
        data = serializers.TagsValueSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class DeviceTagsHistoricalValueView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            device_id = request.GET.device_id
            device = Device.objects.get(id=device_id)
        except:
            device = Device.objects.first()

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

    def get_historical_values_data(self, tag, max=50):
        if tag.data_type == choices.WEBARM_DATA_TYPE_INT:
            values = HistoricalIntValue.objects.filter(tag=tag).order_by('-add_date')[:max][::-1]
            return serializers.HistoricalIntValuesSerializer(values, many=True)
        elif tag.data_type == choices.WEBARM_DATA_TYPE_FLOAT:
            values = HistoricalFloatValue.objects.filter(tag=tag).order_by('-add_date')[:max][::-1]
            return serializers.HistoricalFloatValuesSerializer(values, many=True)
        elif tag.data_type == choices.WEBARM_DATA_TYPE_STRING:
            values = HistoricalStringValue.objects.filter(tag=tag).order_by('-add_date')[:max][::-1]
            return serializers.HistoricalStringValuesSerializer(values, many=True)           
        elif tag.data_type == choices.WEBARM_DATA_TYPE_BOOL:
            values = HistoricalBooleanValue.objects.filter(tag=tag).order_by('-add_date')[:max][::-1]
            return serializers.HistoricalBooleanValuesSerializer(values, many=True)           
        else:
            return {'Error: data type not supported'} 

        

# view for polling modbus devices
class ModbusDeviceView(APIView):
    def get(self, request, *args, **kwargs):
        device = Device.objects.first()
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
 
 


