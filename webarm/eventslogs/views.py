import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from devices.models import Device
from .models import Log, Record, Event
from .serializers import LogRecordSerializer, EventSerializer


def get_device_obj(request):
    device_id = request.GET.get('id', None)
    return Device.objects.get(id=device_id)


class EventsLogView(APIView):
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        categories = request.GET.getlist('categories[]', None)

        try:
            log = Log.objects.get(device=device)
            if categories :
                records = Record.objects.filter(log=log, category__in=categories).order_by('-date')
            else:
                records = Record.objects.filter(log=log).order_by('-date')
            serializer = LogRecordSerializer(records, many=True)
            data = serializer.data
        except Log.DoesNotExist:
            data = []
        return Response(data, status=status.HTTP_200_OK)

class EventsConfigView(APIView):
    def get(self, request, *args, **kwargs):
        device = get_device_obj(request)
        events_id = request.GET.getlist('events_id[]', None)
        if events_id:
            # return selected objects
            events = Event.objects.filter(id__in=events_id, device=device).order_by('id')
        else:
            # return all
            events = Event.objects.filter(device=device).order_by('id')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        device = get_device_obj(request)
        events = request.data
        response_data = []
        for e in events:
            serializer = None
            if e.get('id', False) :
                # update
                try:
                    event_obj = Event.objects.get(id = e['id'], device = device)
                    serializer = EventSerializer(event_obj, data=e)
                except Event.DoesNotExist:
                    # event with this id does not exist for this device
                    error = 'event with id = %s does not exist for device = %s' %(e['id'], device)
                    response_data.append({'id': e['id'],'error': error})
            else:
                # create
                e['device'] = device.id
                serializer = EventSerializer(data=e)

            if serializer:
                if serializer.is_valid():
                    serializer.save()
                    response_data.append(serializer.data)
                else:
                    response_data.append(serializer.errors)

        return Response(response_data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        device = get_device_obj(request)
        events_id = request.GET.getlist('events_id[]', None)
        if events_id:
            # delete all passed events
            events = Event.objects.filter(id__in=events_id, device=device)
            for e in events:
                e.delete()
        else:
            pass
        return Response({}, status=status.HTTP_200_OK)

