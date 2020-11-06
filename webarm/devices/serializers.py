from rest_framework import serializers

from .models import (
    Device, Tag, ModbusDeviceParameters, ModbusTagParameters,
    CurrentStringValue, CurrentIntValue, CurrentFloatValue, CurrentBooleanValue,
) 

# ---------------------------------------------------------------------
# devices
class ModbusDeviceParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModbusDeviceParameters
        exclude = ['id', 'device']


class DeviceParametersSerializer(serializers.ModelSerializer):
    modbus_parameters = ModbusDeviceParametersSerializer()

    class Meta:
        model = Device
        fields = (
            'id', 
            'name', 
            'polling_period',
            'modbus_parameters', 
        )

# ---------------------------------------------------------------------
# tags
class ModbusTagParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModbusTagParameters
        exclude = ['id', 'tag']


class TagsParametersSerializer(serializers.ModelSerializer):
    modbus_parameters = ModbusTagParametersSerializer()

    class Meta:
        model = Tag
        fields = (
            'id',
            'code',  
            'modbus_parameters',
        )


class TagsValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('code', 'name', 'data_type', 'value')


class StringValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentStringValue
        fields = ('tag', 'value', 'quality')

class IntValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentIntValue
        fields = ('tag', 'value', 'quality')

class FloatValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentFloatValue
        fields = ('tag', 'value', 'quality')     

class BooleanValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentBooleanValue
        fields = ('tag', 'value', 'quality')