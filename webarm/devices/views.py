from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Device, Tag, CurrentIntValue, CurrentFloatValue, CurrentStringValue, CurrentBooleanValue
from . import serializers
from . import choices

import json, os
import traceback

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


# view for polling modbus devices
class ModbusDeviceView(APIView):
    def get(self, request, *args, **kwargs):
        device = Device.objects.first()
        tags = Tag.objects.filter(device=device)
        data = {
            'device_parametes': serializers.DeviceParametersSerializer(device).data
        }
        data['device_parametes']['tags'] = serializers.TagsParametersSerializer(tags, many=True).data
        data['device_parametes']['tags_count'] = len(data['device_parametes']['tags'])
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
            response = Response({'tags': tags_response})
        except Exception as e:
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
 
 



'''
class TestDataView(APIView):
    def get(self, request, *args, **kwargs):
        data = {}
        path = os.path.join(settings.BASE_DIR, 'devices/com_test/GET.json')
        print(path)
        with open(path, 'r', encoding='utf-8') as file:
            data = json.load(file)  
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = {}
        path = os.path.join(settings.BASE_DIR, 'devices/com_test/POST.json')
        with open(path, 'r', encoding='utf-8') as file:
            data = json.load(file)  
        return Response(data, status=status.HTTP_201_CREATED)

'''