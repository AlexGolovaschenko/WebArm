from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import (CurrentIntValue, CurrentFloatValue, 
    CurrentStringValue, CurrentBooleanValue, HistoricalIntValue, 
    HistoricalFloatValue, HistoricalStringValue, HistoricalBooleanValue, 
)
from eventlogs.utils import check_events


@receiver(post_save, sender=CurrentIntValue)
def current_int_value_changed(sender, instance, **kwargs):
    obj = HistoricalIntValue.objects.create(
            tag = instance.tag, 
            value = instance.value,
            quality = instance.quality
        )
    obj.save()
    instance.tag.device.last_update = timezone.now()
    instance.tag.device.save()
    check_events(instance.tag)


@receiver(post_save, sender=CurrentFloatValue)
def current_float_value_changed(sender, instance, **kwargs):
    obj = HistoricalFloatValue.objects.create(
            tag = instance.tag, 
            value = instance.value,
            quality = instance.quality
        )
    obj.save()
    instance.tag.device.last_update = timezone.now()
    instance.tag.device.save()
    check_events(instance.tag)


@receiver(post_save, sender=CurrentStringValue)
def current_string_value_changed(sender, instance, **kwargs):
    obj = HistoricalStringValue.objects.create(
            tag = instance.tag, 
            value = instance.value,
            quality = instance.quality
        )
    obj.save()
    instance.tag.device.last_update = timezone.now()
    instance.tag.device.save()
    check_events(instance.tag)


@receiver(post_save, sender=CurrentBooleanValue)
def current_boolean_value_changed(sender, instance, **kwargs):
    obj = HistoricalBooleanValue.objects.create(
            tag = instance.tag, 
            value = instance.value,
            quality = instance.quality
        )
    obj.save()
    instance.tag.device.last_update = timezone.now()
    instance.tag.device.save()
    check_events(instance.tag)


