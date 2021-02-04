from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone

import re
from .handle_user_expressions import parse_used_tags, eval_expression

from devices.models import Device
from . import choices


class Event(models.Model):
    # configuration fields
    device = models.ForeignKey(Device, on_delete=models.CASCADE, verbose_name='Устройство')
    categories = ArrayField(models.CharField(max_length=20, choices=choices.EVENT_CATEGORIES), blank=True, default=list, verbose_name='Категории')
    enable = models.BooleanField(verbose_name='Активировать', default=False)
    expression = models.TextField(verbose_name='Формула', blank=True)     
    raise_message = models.TextField(verbose_name='Сообщение срабатывания', blank=True) 
    fall_message = models.TextField(verbose_name='Сообщение отключения', blank=True) 

    # read only fields
    is_alarm = models.BooleanField(verbose_name='Событие аварийное', default=False)
    is_active = models.BooleanField(verbose_name='Событие активно', default=False)
    raise_time = models.DateTimeField(blank=True, null=True, verbose_name='Время возникновения')
    used_tags = ArrayField(models.CharField(max_length=200), blank=True, default=list, verbose_name='Используемые теги')

    class Meta():
        verbose_name = 'Событие'
        verbose_name_plural = 'События'

    def __str__(self):
        return 'Событие: %s' % ( str(self.raise_message)[:50] + ('...' if len(str(self.raise_message)) > 50 else ''))
    
    def save(self, *args, **kwargs):
        self.used_tags = parse_used_tags(self.expression)
        super(Event, self).save(*args, **kwargs)

    def check_event(self):
        res = eval_expression(self.expression)
        if res:
            if not self.is_active: self._add_record_to_log(self.raise_message)
            self.is_active = True
        else:
            if self.is_active: self._add_record_to_log(self.fall_message)
            self.is_active = False
        self.save()

    def _add_record_to_log(self, message):
        log = Log.objects.get(device = self.device)
        Record.objects.create(log = log, message = message)



class Log(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, verbose_name='Устройство')

    class Meta():
        verbose_name = 'Журнал событий'
        verbose_name_plural = 'Журналы событий'

    def __str__(self):
        return 'Журнал (%s)' % self.id


class Record(models.Model):
    log = models.ForeignKey(Log, on_delete=models.CASCADE, verbose_name='Журнал')
    message = models.TextField(verbose_name='Сообщение', default='-')
    date = models.DateTimeField(verbose_name='Время и дата записи', auto_now_add=True)

    class Meta():
        verbose_name = 'Запись журнала'
        verbose_name_plural = 'Записи журналов'

    def __str__(self):
        return 'Запись (%s): %s' %(self.id, self.message)



