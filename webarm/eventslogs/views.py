from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from devices.models import Device

from .models import Log, Record
from .serializers import LogRecordSerializer


def get_device_obj(request):
    device_id = request.GET.get('id', None)
    return Device.objects.get(id=device_id)


class EventsLogView(APIView):
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        log = Log.objects.get(device=device)
        records = Record.objects.filter(log=log).order_by('-date')
        serializer = LogRecordSerializer(records, many=True)
        return Response(serializer.data)

