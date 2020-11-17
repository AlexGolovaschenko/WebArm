from django.db import models

from . import choices
from connectors.models import Connector

class Device(models.Model):
    connector = models.ForeignKey(Connector, on_delete=models.SET_NULL, null=True, verbose_name='Коннектор')
    name = models.CharField(max_length = 200, verbose_name='Наименование устройства', blank=False)
    polling_period = models.PositiveSmallIntegerField(verbose_name='Период опроса устройства, сек', default=300)
    timeout = models.PositiveSmallIntegerField(verbose_name='Таймайут потери связи с устройством, сек', default=1500)

    @property
    def modbus_parameters(self):
        return ModbusDeviceParameters.objects.get(device=self)

    def __str__(self):
        return self.name

    class Meta():
        verbose_name = 'Устройство'
        verbose_name_plural = 'Устройства'


class ModbusDeviceParameters(models.Model):
    device = models.OneToOneField(Device, on_delete = models.CASCADE)
    protocol_type = models.CharField(max_length = 5, verbose_name='Протокол', choices=choices.MODBUS_PROTOCOL_TYPE, default='RTU') 
    device_address = models.PositiveSmallIntegerField(verbose_name='Адрес устройства', default=1)
    boudrate = models.PositiveSmallIntegerField(verbose_name='Скорость обмена данными', choices=choices.MODBUS_BAUDRATE, default=9600)
    address_size = models.CharField(max_length = 1, verbose_name='Длинна адреса', choices=choices.MODBUS_ADDRESS_SIZE, default='8')
    parity = models.CharField(max_length = 4, verbose_name='Контроль четности', choices=choices.MODBUS_PARITY, default='none') 
    stopbit = models.CharField(max_length = 1, verbose_name='Стоп бит', choices=choices.MODBUS_STOP_BIT, default='1')
    bit_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут бита, мс', default=100)
    packet_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут соединения, мс', default=300)
    allow_group_reading = models.BooleanField(verbose_name='Разрешить груповое чтение', default=False)
    lower_byte_forward = models.BooleanField(default=True)
    lower_register_forward = models.BooleanField(default=False)
    
    def __str__(self):
        return 'Параметры Modbus ' + self.device.name

    class Meta():
        verbose_name = 'Параметры устройства модбас'
        verbose_name_plural = 'Параметры устройств модбас'


#--------------------------------------------------------------------------------------------------------
class Tag(models.Model):
    code = models.CharField(max_length=40, verbose_name='Код', unique=True)
    name = models.CharField(max_length=100, verbose_name='Наименование')
    device = models.ForeignKey(Device, on_delete = models.CASCADE)
    data_type = models.CharField(max_length=20, verbose_name='Тип данных', choices=choices.WEBARM_SUPPORTED_DATA_TYPES)
    display_on_graph_by_default = models.BooleanField(default=False, verbose_name='Отображать на графике')

    @property
    def value(self):
        if self.data_type == choices.WEBARM_DATA_TYPE_INT:
            try:
                return CurrentIntValue.objects.get(tag=self).value
            except:
                return 'none'  
        elif self.data_type == choices.WEBARM_DATA_TYPE_FLOAT:
            try:
                return CurrentFloatValue.objects.get(tag=self).value
            except:
                return 'none'
        elif self.data_type == choices.WEBARM_DATA_TYPE_STRING:
            try:
                return CurrentStringValue.objects.get(tag=self).value
            except:
                return 'none'      
        elif self.data_type == choices.WEBARM_DATA_TYPE_BOOL:
            try:
                return CurrentBooleanValue.objects.get(tag=self).value
            except:
                return 'none'   
        else:
            return 'Error: data type not supported'       

    @property
    def modbus_parameters(self):
        return ModbusTagParameters.objects.get(tag=self)

    def __str__(self):
        return self.code

    class Meta():
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

class ModbusTagParameters(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    data_type = models.CharField(max_length = 50, blank=False, choices=choices.MODBUS_DATA_TYPES)
    register_address = models.PositiveSmallIntegerField(blank=False)
    read_function = models.CharField(max_length=2, choices=choices.MODBUS_READ_FUNCTIONS, default='4')
    write_function = models.CharField(max_length=2, choices=choices.MODBUS_WRITE_FUNCTIONS, default='16')

    def __str__(self):
        return 'Параметры регистра Modbus ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Параметры регистра модбас'
        verbose_name_plural = 'Параметры регистров модбас'


#--------------------------------------------------------------------------------------------------------
class CurrentIntValue(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    value = models.IntegerField(verbose_name='INTEGER-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')

    def __str__(self):
        return 'Текущее значение ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Текущее INTEGER-значение тега'
        verbose_name_plural = 'Текущие INTEGER-значения тега'


class CurrentFloatValue(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    value = models.FloatField(verbose_name='FLOAT-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')

    def __str__(self):
        return 'Текущее значение ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Текущее FLOAT-значение тега'
        verbose_name_plural = 'Текущие FLOAT-значения тега'


class CurrentStringValue(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    value = models.CharField(max_length = 200, verbose_name='STRING-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')

    def __str__(self):
        return 'Текущее значение ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Текущее STRING-значение тега'
        verbose_name_plural = 'Текущие STRING-значения тега'


class CurrentBooleanValue(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    value = models.BooleanField(verbose_name='BOOLEAN-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')

    def __str__(self):
        return 'Текущее значение ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Текущее BOOLEAN-значение тега'
        verbose_name_plural = 'Текущие BOOLEAN-значения тега'


#--------------------------------------------------------------------------------------------------------
class HistoricalIntValue(models.Model):
    tag = models.ForeignKey(Tag, on_delete = models.CASCADE)
    value = models.IntegerField(verbose_name='INTEGER-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')
    add_date = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Дата и время')

    def __str__(self):
        return f'Архивное значение {self.tag.code} = {self.value} ({self.add_date.strftime("%d.%m.%Y %H:%M:%S")})'

    class Meta():
        verbose_name = 'Архивное INTEGER-значение тега'
        verbose_name_plural = 'Архивные INTEGER-значения тега'


class HistoricalFloatValue(models.Model):
    tag = models.ForeignKey(Tag, on_delete = models.CASCADE)
    value = models.FloatField(verbose_name='FLOAT-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')
    add_date = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Дата и время')

    def __str__(self):
        return f'Архивное значение {self.tag.code} = {self.value} ({self.add_date.strftime("%d.%m.%Y %H:%M:%S")})'

    class Meta():
        verbose_name = 'Архивное FLOAT-значение тега'
        verbose_name_plural = 'Архивные FLOAT-значения тега'


class HistoricalStringValue(models.Model):
    tag = models.ForeignKey(Tag, on_delete = models.CASCADE)
    value = models.CharField(max_length = 200, verbose_name='STRING-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')
    add_date = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Дата и время')

    def __str__(self):
        return f'Архивное значение {self.tag.code} = {self.value} ({self.add_date.strftime("%d.%m.%Y %H:%M:%S")})'

    class Meta():
        verbose_name = 'Архивное STRING-значение тега'
        verbose_name_plural = 'Архивные STRING-значения тега'


class HistoricalBooleanValue(models.Model):
    tag = models.ForeignKey(Tag, on_delete = models.CASCADE)
    value = models.BooleanField(verbose_name='BOOLEAN-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')
    add_date = models.DateTimeField(auto_now=False, auto_now_add=True, verbose_name='Дата и время')

    def __str__(self):
        return f'Архивное значение {self.tag.code} = {self.value} ({self.add_date.strftime("%d.%m.%Y %H:%M:%S")})'

    class Meta():
        verbose_name = 'Архивное BOOLEAN-значение тега'
        verbose_name_plural = 'Архивные BOOLEAN-значения тега'