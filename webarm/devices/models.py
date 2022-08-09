from django.db import models
from django.utils import timezone

from . import choices
from facilities.models import Facility
from connectors.models import Connector


class Device(models.Model):
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, verbose_name='Объект')
    connector = models.ForeignKey(Connector, on_delete=models.SET_NULL, null=True, verbose_name='Коннектор')
    name = models.CharField(max_length=200, verbose_name='Наименование устройства', blank=False)
    polling_period = models.PositiveSmallIntegerField(verbose_name='Период опроса устройства, сек', default=30)
    timeout = models.PositiveSmallIntegerField(verbose_name='Таймайут потери связи с устройством, сек', default=600)
    last_update = models.DateTimeField(blank=True, null=True, verbose_name='Время последнего обновления данных')

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

    def __str__(self):
        return self.name

    class Meta():
        verbose_name = 'Устройство'
        verbose_name_plural = 'Устройства'


def verbose_update_timestamp(update_timestamp):
    ''' возвращает время посленего обновления данных устройства в более удобном для чтения виде
        например: "только что", "3 минтуы назад", "вчера" ...
    '''
    if not update_timestamp:
        return 'никогда'
    if update_timestamp > (timezone.now()-timezone.timedelta(minutes=1)):
        return 'только что'
    elif update_timestamp > (timezone.now()-timezone.timedelta(minutes=2)):
        return '1 минуту назад'    
    elif update_timestamp > (timezone.now()-timezone.timedelta(minutes=4)):
        td = timezone.now() - update_timestamp
        return '%s минуты назад' %( (td.seconds//60)%60 )
    elif update_timestamp > (timezone.now()-timezone.timedelta(minutes=59)):
        td = timezone.now() - update_timestamp
        return '%s минут назад' %( (td.seconds//60)%60 )
    elif update_timestamp > (timezone.now()-timezone.timedelta(hours=2)):
        return 'больше часа назад' 
    elif update_timestamp > (timezone.now()-timezone.timedelta(hours=24)):
        td = timezone.now() - update_timestamp
        return 'больше %s часов назад' %( td.seconds//3600 ) 
    elif update_timestamp > (timezone.now()-timezone.timedelta(days=1, hours=24)):
        return 'вчера, в %s' %( update_timestamp.strftime("%H:%M") )                                   
    else:
        return update_timestamp.strftime("%d %b %H:%M")


#-------------------------------------------------------------------------------
class DeviceProtocol(models.Model):
    device = models.OneToOneField(Device, on_delete=models.CASCADE)
    protocol_type = models.CharField(max_length=20, verbose_name='Протокол', 
        choices=choices.DEVICE_PROTOCOL_TYPE, 
        default=choices.DEVICE_PROTOCOL_MODBUS_RTU)

    @property
    def protocol_parameters(self):
        return self.ProtocolParametersModel.objects.get(protocol=self)

    @property
    def ProtocolParametersModel(self):
        if self.protocol_type == choices.DEVICE_PROTOCOL_MODBUS_RTU:
            return ModbusRtuProtocolParameters
        elif self.protocol_type == choices.DEVICE_PROTOCOL_MODBUS_ASCII:
            return ModbusAsciiProtocolParameters
        elif self.protocol_type == choices.DEVICE_PROTOCOL_MODBUS_TCP:
            return ModbusTcpProtocolParameters
        else:
            raise('Error: protocol type "%s" is not supported' %(self.protocol_type))

    def __str__(self):
        return 'Параметры связи с устройством ' + self.device.name

    class Meta():
        verbose_name = 'Параметры связи с устройством'
        verbose_name_plural = 'Параметры связи с устройством'


class ModbusRtuProtocolParameters(models.Model):
    protocol = models.OneToOneField(DeviceProtocol, on_delete=models.CASCADE)
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
        return 'Параметры Modbus-RTU ' + self.protocol.device.name

    class Meta():
        verbose_name = 'Параметры Modbus-RTU'
        verbose_name_plural = 'Параметры Modbus-RTU'


class ModbusAsciiProtocolParameters(models.Model):
    protocol = models.OneToOneField(DeviceProtocol, on_delete=models.CASCADE)
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
        return 'Параметры Modbus-ASCII ' + self.protocol.device.name

    class Meta():
        verbose_name = 'Параметры Modbus-ASCII'
        verbose_name_plural = 'Параметры Modbus-ASCII'


class ModbusTcpProtocolParameters(models.Model):
    protocol = models.OneToOneField(DeviceProtocol, on_delete=models.CASCADE)
    device_ip = models.PositiveSmallIntegerField(verbose_name='IP-адрес устройства', default=1)
    packet_timout = models.PositiveSmallIntegerField(verbose_name='Таймаут соединения, мс', default=300)
    allow_group_reading = models.BooleanField(verbose_name='Разрешить груповое чтение', default=True)
    lower_byte_forward = models.BooleanField(default=True)
    lower_register_forward = models.BooleanField(default=False)
    
    def __str__(self):
        return 'Параметры Modbus-TCP ' + self.protocol.device.name

    class Meta():
        verbose_name = 'Параметры Modbus-TCP'
        verbose_name_plural = 'Параметры Modbus-TCP'

