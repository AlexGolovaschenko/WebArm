from django.db import models

from . import choices
from devices.models import Device


#--------------------------------------------------------------------------------------------------------
class Tag(models.Model):
    device = models.ForeignKey(Device, on_delete = models.CASCADE, verbose_name='Устройство')
    code = models.CharField(max_length=40, verbose_name='Код')
    name = models.CharField(max_length=100, verbose_name='Наименование')
    data_type = models.CharField(max_length=20, verbose_name='Тип данных', choices=choices.SUPPORTED_DATA_TYPES)

    @property
    def value(self):
        try:
            v = self.CurrentValueModel.objects.get(tag=self).value
        except:
            v = 'none'        
        return v   

    @property
    def CurrentValueModel(self):
        if self.data_type == choices.DATA_TYPE_INT:
            return CurrentIntValue
        elif self.data_type == choices.DATA_TYPE_FLOAT:
            return CurrentFloatValue
        elif self.data_type == choices.DATA_TYPE_STRING:
            return CurrentStringValue     
        elif self.data_type == choices.DATA_TYPE_BOOL:
            return CurrentBooleanValue
        else:
            raise('Error: tag data type "%s" not supported' %(self.data_type))           

    @property
    def HistoricalValueModel(self):
        if self.data_type == choices.DATA_TYPE_INT:
            return HistoricalIntValue
        elif self.data_type == choices.DATA_TYPE_FLOAT:
            return HistoricalFloatValue
        elif self.data_type == choices.DATA_TYPE_STRING:
            return HistoricalStringValue     
        elif self.data_type == choices.DATA_TYPE_BOOL:
            return HistoricalBooleanValue
        else:
            raise('Error: tag data type "%s" not supported' %(self.data_type))  

    @property
    def modbus_parameters(self):
        return ModbusTagParameters.objects.get(tag=self)

    def __str__(self):
        return self.code

    class Meta():
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'
        unique_together = ['code', 'device']


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
        indexes = [
                    models.Index(fields=['tag', 'add_date']),
                    models.Index(fields=['add_date']),
                ]

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
        indexes = [
                    models.Index(fields=['tag', 'add_date']),
                    models.Index(fields=['add_date']),
                ]

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
        indexes = [
                    models.Index(fields=['tag', 'add_date']),
                    models.Index(fields=['add_date']),
                ]

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
        indexes = [
                    models.Index(fields=['tag', 'add_date']),
                    models.Index(fields=['add_date']),
                ]        



#-------------------------------------------------------------------------------
class ModbusTagParameters(models.Model):
    tag = models.OneToOneField(Tag, on_delete = models.CASCADE)
    register_address = models.PositiveSmallIntegerField(blank=False)
    read_function = models.CharField(max_length=2, choices=choices.MODBUS_READ_FUNCTIONS, default='4')
    write_function = models.CharField(max_length=2, choices=choices.MODBUS_WRITE_FUNCTIONS, default='16')

    def __str__(self):
        return 'Параметры протокола Modbus ' + str(self.tag.code)

    class Meta():
        verbose_name = 'Параметры протокола Modbus'
        verbose_name_plural = 'Параметры протокола Modbus'