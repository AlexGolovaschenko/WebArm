from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone

from devices.models import Device


class Event(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, verbose_name='Устройство')
    categories = ArrayField(models.CharField(max_length=200), blank=True, verbose_name='Категории')
    enable = models.BooleanField(verbose_name='Активировать', default=False)
    expression = models.TextField(verbose_name='Формула', blank=True)     
    raise_message = models.TextField(verbose_name='Сообщение срабатывания', blank=True) 
    fall_message = models.TextField(verbose_name='Сообщение отключения', blank=True) 

    is_alarm = models.BooleanField(verbose_name='Событие аварийное', default=False)
    is_active = models.BooleanField(verbose_name='Событие активно', default=False)
    raise_time = models.DateTimeField(blank=True, verbose_name='Время возникновения')

    class Meta():
        verbose_name = 'Событие'
        verbose_name_plural = 'События'

    def __str__(self):
        return 'Событие: %s' % ( str(self.raise_message)[:50] + ('...' if len(str(self.raise_message)) > 50 else ''))
    


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
        return 'Запись (%s)' % self.id