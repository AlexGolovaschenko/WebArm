from django.db import models

from . import choices


class Device(models.Model):
    name = models.CharField(max_length = 200, verbose_name='Наименование устройства', blank=False)
    polling_period = models.PositiveSmallIntegerField(verbose_name='Период опроса устройства, сек', default=300)
    timeout = models.PositiveSmallIntegerField(verbose_name='Таймайут потери связи с устройством, сек', default=1500)
    connector_type = models.CharField(max_length=20, verbose_name='Тип подключения', choices=choices.CONNECTORS)

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

    def __str__(self):
        return 'Параметры Modbus ' + self.device.name

    class Meta():
        verbose_name = 'Параметры устройства модбас'
        verbose_name_plural = 'Параметры устройств модбас'


class Tag(models.Model):
    code = models.CharField(max_length=40, verbose_name='Код', unique=True)
    name = models.CharField(max_length=100, verbose_name='Наименование')
    device = models.ForeignKey(Device, on_delete = models.CASCADE)
    data_type = models.CharField(max_length=20, verbose_name='Тип данных', choices=choices.WEBARM_SUPPORTED_DATA_TYPES)

    @property
    def value(self):
        return 17  

    def __str__(self):
        return self.code

    class Meta():
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

class ModbusTagParameters(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    data_type = models.CharField(max_length = 50, blank=False)
    register_address = models.PositiveSmallIntegerField(blank=False)
    read_function = models.CharField(max_length=2, choices=choices.MODBUS_READ_FUNCTIONS, default='4')
    write_function = models.CharField(max_length=2, choices=choices.MODBUS_WRITE_FUNCTIONS, default='16')
    lower_byte_forward = models.BooleanField(default=True)
    lower_register_forward = models.BooleanField(default=False)

    def __str__(self):
        return 'Параметры регистра Modbus ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Параметры регистра модбас'
        verbose_name_plural = 'Параметры регистров модбас'


class CurrentStringValue(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    value = models.CharField(max_length = 200, verbose_name='STRING-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')

    def __str__(self):
        return 'Текущее значение ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Текущее STRING-значение тега'
        verbose_name_plural = 'Текущие STRING-значения тега'


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


class CurrentBooleanValue(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    value = models.BooleanField(verbose_name='BOOLEAN-значение', blank=True)
    quality = models.CharField(max_length = 4, verbose_name='Качество', choices=choices.TAG_VALUE_QUALITY, default='BAD')

    def __str__(self):
        return 'Текущее значение ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Текущее BOOLEAN-значение тега'
        verbose_name_plural = 'Текущие BOOLEAN-значения тега'