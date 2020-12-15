from django.utils import timezone
from datetime import timedelta

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
        device = get_device_obj(request)
        tags = Tag.objects.filter(device=device).order_by('name')
        data = serializers.TagsValueSerializer(tags, many=True).data
        return Response(data, status=status.HTTP_200_OK)


# -----------------------------------------------------------------------------------------------
class DeviceTagsHistoricalValueView(APIView):
    ''' return list of historycal values of device tags (value and date/time) '''    
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        tags = Tag.objects.filter(device=device).order_by('name')
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
                if v.add_date > (prev.add_date + timezone.timedelta(minutes=1)):
                    sv.append(v)
                    prev = v
        return sv
        



