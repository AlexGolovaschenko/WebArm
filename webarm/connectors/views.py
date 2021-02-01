from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import exceptions

from devices.models import (
    Device, Tag, ModbusDeviceParameters
)
from devices.serializers import (
    DeviceParametersSerializer, ModbusDeviceParametersSerializer, TagsParametersSerializer,
    get_current_tag_value_serializer
)
from devices import choices

from .models import Connector


# -----------------------------------------------------------------------------------------------
# view for polling modbus devices
class ModbusDeviceView(APIView):
    ''' 
    through this vie you can get modbus parameters for polling modbus device
    and post tags value data  
    '''
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request, *args, **kwargs):
        devices = self._get_device_objects(request)
        data = []
        for device in devices:
            tags = Tag.objects.filter(device=device)
            modbus_parameters = ModbusDeviceParameters.objects.get(device=device)
            device_data = {
                'device': DeviceParametersSerializer(device).data, 
                'modbus_parameters': ModbusDeviceParametersSerializer(modbus_parameters).data               
            }
            tags_list = TagsParametersSerializer(tags, many=True).data
            device_data['tags_count'] = len(tags_list)        
            device_data['tags'] = tags_list
            data.append(device_data)
        return Response(data)

    def post(self, request, *args, **kwargs):
        connector = self._get_connector(request)
        tags = request.data['tags']
        tags_response = []
        for t in tags:
            try:
                tag_obj = Tag.objects.get(id=t['id'], device__connector=connector)
                r = self._update_tag_value(tag_obj, t['value'], choices.TAG_VALUE_QUALITY_GOOD)
                tags_response.append(r)
            except Exception as e:
                print(e)
                tags_response.append({"tag":t['id'],"error":'object does not exist'})
        response = Response({'tags': tags_response}, status=status.HTTP_201_CREATED)
        return response

    def _update_tag_value(self, tag_obj, tag_value, tag_quality):
        ''' write tag value depending on tag data type '''    
        data = {'tag': tag_obj.id, 'value':tag_value, 'quality':tag_quality}

        serializer = get_current_tag_value_serializer(tag_obj)
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

    def _get_device_objects(self, request):
        device_id = request.GET.get('id', None)
        connector = self._get_connector(request)
        if device_id:
            return Device.objects.filter(id=device_id, connector=connector)
        else:
            return Device.objects.filter(connector=connector)


    def _get_connector(self, request):
        authorization_token = request.META.get('HTTP_AUTHORIZATION', None)  # check modem token
        try:
            key, authorization_token = authorization_token.split(' ')
            return Connector.objects.get(token=authorization_token)
        except:
            raise exceptions.AuthenticationFailed('invalide authorization token')

