from django.utils import timezone

from .models import Device


def get_device_obj_from_request(request):
    device_id = request.GET.get('id', None)
    return Device.objects.get(id=device_id)


