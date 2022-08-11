from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import exceptions

from .models import Connector
from . import utils

from tags.models import Tag
from tags.choices import TAG_VALUE_QUALITY_GOOD
from devices.models import Device
from devices.serializers import DeviceParametersSerializer, TagsParametersSerializer


class RestApiConnectorView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()
    
    def get(self, request, *args, **kwargs):
        devices = self._get_devices_from_request(request)
        data = []
        for device in devices:
            tags = Tag.objects.filter(device=device)
            # modbus_parameters = DeviceProtocol.objects.get(device=device)
            device_data = {
                'device': DeviceParametersSerializer(device).data, 
                # 'modbus_parameters': DeviceProtocolSerializer(modbus_parameters).data               
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
                r = utils.update_tag_value(tag_obj, t['value'], TAG_VALUE_QUALITY_GOOD)
                tags_response.append(r)
            except Exception as e:
                print(e)
                tags_response.append({"tag":t['id'],"error":'object does not exist'})
        response = Response({'tags': tags_response}, status=status.HTTP_201_CREATED)
        return response

    def _get_devices_from_request(self, request):
        device_id = request.GET.get('id', None)
        connector = self._get_connector_from_request(request)
        if device_id:
            return Device.objects.filter(id=device_id, connector=connector)
        else:
            return Device.objects.filter(connector=connector)

    def _get_connector_from_request(self, request):
        # check connector token
        authorization_token = request.META.get('HTTP_AUTHORIZATION', None)
        try:
            key, authorization_token = authorization_token.split(' ')
            return Connector.objects.get(token=authorization_token)
        except:
            raise exceptions.AuthenticationFailed('invalide authorization token')

