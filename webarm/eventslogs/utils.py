from .models import Event
from . import choices


def check_events(updated_tag):
    device_obj = updated_tag.device
    device_events = Event.objects.filter(device=device_obj)

    for event in device_events:
        event_tags = event.used_tags
        if updated_tag.code in event_tags:
            event.check_event()




def decode_categories(categories):
    dc = []
    for c in categories:
        if c == 'Alarm':
            dc.append(choices.EVENT_CATEGORY_ALARM)
        elif  c == 'Warning':
            dc.append(choices.EVENT_CATEGORY_WARNING)
        elif  c == 'Info':
            dc.append(choices.EVENT_CATEGORY_INFO)
        elif  c == 'Debug':
            dc.append(choices.EVENT_CATEGORY_DEBUG)            
        else:
            pass
    return dc