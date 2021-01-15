import json
from django.db import models

from devices.models import Device
from widgets.default_template import get_default_template


class WidgetsTemplate(models.Model):
    device = models.ForeignKey(Device, on_delete = models.CASCADE, verbose_name='Устройство')
    template = models.JSONField(encoder=None, decoder=None, default=get_default_template, verbose_name='Шаблон виджетов')

    class Meta:
        verbose_name = 'Шаблон виджетов'
        verbose_name_plural = 'Шаблоны виджетов'

    def __str__(self):
        return 'Шаблон (%s)' %(self.id)