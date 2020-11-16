from django.db import models

from . import choices


class Connector(models.Model):
    token = models.CharField(max_length=40, unique=True, verbose_name='Токен')
    connector_type = models.CharField(max_length=20, verbose_name='Тип подключения', choices=choices.CONNECTORS)
    created = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Дата регистрации')
    registration_code = models.CharField(max_length=10, unique=True, blank=True, null=True, verbose_name='Код регистрации')

    def __str__(self):
        return str(self.connector_type) + ' (token: ' + str(self.token) + ')'

    class Meta:
        verbose_name = 'Коннектор'
        verbose_name_plural = 'Коннекторы'