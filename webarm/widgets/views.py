from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import WidgetsTemplate
from .serializers import WidgetsTemplateSerializer
from devices.views import get_device_obj_from_request


class WidgetsTemplateView(APIView):
    def get(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request)
        template_obj = WidgetsTemplate.objects.filter(device=device).first()
        data = WidgetsTemplateSerializer(template_obj).data
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        device = get_device_obj_from_request(request)
        template_data = request.data['template']

        templates_qs = WidgetsTemplate.objects.filter(device=device)
        if templates_qs.exists():
            # update template
            obj = templates_qs.first()
            serializer = WidgetsTemplateSerializer(obj, 
                data={'template': template_data}, partial=True)
        else:
            # create template
            serializer = WidgetsTemplateSerializer(
                data={'device': device.id, 'template': template_data})

        if serializer.is_valid():
            serializer.save()
            responce_data = {'success':'template has been successfully updated'}
        else:
            responce_data = serializer.errors

        return Response(responce_data, status=status.HTTP_201_CREATED)        

