from django.db import models
from django.utils import timezone

from . import choices
from .utils import verbose_update_timestamp
from facilities.models import Facility
from connectors.models import Connector


class ModbusRtuProtocolParameters(models.Model):
    device_address = models.PositiveSmallIntegerField(verbose_name='Адрес устройства', default=1)
    baudrate = models.PositiveIntegerField(verbose_name='Скорость обмена данными', choices=choices.MODBUS_BAUDRATE, default=9600)
    address_size = models.CharField(max_length=1, verbose_name='Длинна адреса', choices=choices.MODBUS_ADDRESS_SIZE, default='8')
    parity = models.CharField(max_length=4, verbose_name='Контроль четности', choices=choices.MODBUS_PARITY, default='none') 
    stopbit = models.CharField(max_length=1, verbose_name='Стоп бит', choices=choices.MODBUS_STOP_BIT, default='1')
    bit_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут бита, мс', default=100)
    packet_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут соединения, мс', default=300)
    allow_group_reading = models.BooleanField(verbose_name='Разрешить груповое чтение', default=True)
    lower_byte_forward = models.BooleanField(default=True)
    lower_register_forward = models.BooleanField(default=False)
    
    def __str__(self):
        return 'Параметры Modbus-RTU'

    class Meta():
        verbose_name = 'Параметры Modbus-RTU'
        verbose_name_plural = 'Параметры Modbus-RTU'


class ModbusAsciiProtocolParameters(models.Model):
    device_address = models.PositiveSmallIntegerField(verbose_name='Адрес устройства', default=1)
    baudrate = models.PositiveIntegerField(verbose_name='Скорость обмена данными', choices=choices.MODBUS_BAUDRATE, default=9600)
    address_size = models.CharField(max_length=1, verbose_name='Длинна адреса', choices=choices.MODBUS_ADDRESS_SIZE, default='8')
    parity = models.CharField(max_length=4, verbose_name='Контроль четности', choices=choices.MODBUS_PARITY, default='none') 
    stopbit = models.CharField(max_length=1, verbose_name='Стоп бит', choices=choices.MODBUS_STOP_BIT, default='1')
    bit_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут бита, мс', default=100)
    packet_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут соединения, мс', default=300)
    allow_group_reading = models.BooleanField(verbose_name='Разрешить груповое чтение', default=True)
    lower_byte_forward = models.BooleanField(default=True)
    lower_register_forward = models.BooleanField(default=False)
    
    def __str__(self):
        return 'Параметры Modbus-ASCII'

    class Meta():
        verbose_name = 'Параметры Modbus-ASCII'
        verbose_name_plural = 'Параметры Modbus-ASCII'


class ModbusTcpProtocolParameters(models.Model):
    device_ip = models.CharField(max_length=16, verbose_name='IP-адрес устройства', default='127.0.0.1')
    packet_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут соединения, мс', default=300)
    allow_group_reading = models.BooleanField(verbose_name='Разрешить груповое чтение', default=True)
    lower_byte_forward = models.BooleanField(default=True)
    lower_register_forward = models.BooleanField(default=False)
    
    def __str__(self):
        return 'Параметры Modbus-TCP'

    class Meta():
        verbose_name = 'Параметры Modbus-TCP'
        verbose_name_plural = 'Параметры Modbus-TCP'


#-------------------------------------------------------------------------------
class Device(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, verbose_name='Объект')
    connector = models.ForeignKey(Connector, on_delete=models.SET_NULL, null=True, verbose_name='Коннектор')
    name = models.CharField(max_length=200, blank=False, verbose_name='Наименование устройства')
    polling_period = models.PositiveSmallIntegerField(default=30, verbose_name='Период опроса устройства, сек')
    timeout = models.PositiveSmallIntegerField(default=600, verbose_name='Таймайут потери связи с устройством, сек')
    last_update = models.DateTimeField(blank=True, null=True, verbose_name='Время последнего обновления данных')

    # communication parameters
    protocol_type = models.CharField(max_length=20, verbose_name='Протокол', 
        choices=choices.DEVICE_PROTOCOL_TYPE, 
        default=choices.DEVICE_PROTOCOL_MODBUS_RTU)
    protocol_mb_rtu = models.OneToOneField(ModbusRtuProtocolParameters, on_delete=models.SET_NULL, null=True)
    protocol_mb_ascii = models.OneToOneField(ModbusAsciiProtocolParameters, on_delete=models.SET_NULL, null=True)
    protocol_mb_tcp = models.OneToOneField(ModbusTcpProtocolParameters, on_delete=models.SET_NULL, null=True)

    @property
    def is_online(self):
        if not self.last_update:
            return False
        online = self.last_update >= (timezone.now()-timezone.timedelta(seconds=self.timeout))
        return online          

    @property
    def verbose_last_update(self):
        ''' возвращает время посленего обновления данных устройства в более удобном для чтения виде
            например: "только что", "3 минтуы назад", "вчера" ...
        '''
        return verbose_update_timestamp(self.last_update)

    def refresh(self):
        # update connection timestamp
        self.last_update = timezone.now()

    def __str__(self):
        return self.name

    class Meta():
        verbose_name = 'Устройство'
        verbose_name_plural = 'Устройства'



