from .models import Event


def check_events(updated_tag):
    device_obj = updated_tag.device
    device_events = Event.objects.filter(device=device_obj)

    for event in device_events:
        event_tags = event.used_tags
        if updated_tag.code in event_tags:
            event.check_event()


