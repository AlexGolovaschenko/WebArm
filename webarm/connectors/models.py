from django.db import models
from django.utils import timezone

from . import choices


class Connector(models.Model):
    connector_type = models.CharField(max_length=20, verbose_name='Тип подключения', choices=choices.CONNECTORS)
    token = models.CharField(max_length=40, unique=True, blank=True, verbose_name='Токен')
    registration_code = models.CharField(max_length=10, unique=True, blank=True, null=True, verbose_name='Код регистрации')
    created = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Дата регистрации')
    last_update = models.DateTimeField(blank=True, null=True, verbose_name='Время последнего сеанса связи')

    def __str__(self):
        return str(self.connector_type) + ' (code: %s)' %(self.registration_code) 

    def refresh(self):
        # update connection timestamp
        self.last_update = timezone.now()

    class Meta:
        verbose_name = 'Коннектор'
        verbose_name_plural = 'Коннекторы'