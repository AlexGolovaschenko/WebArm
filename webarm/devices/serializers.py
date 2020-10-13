from rest_framework import serializers

from .models import Device, Tag, ModbusDeviceParameters, ModbusTagParameters 


class ModbusDeviceParametersSerializer(serializers.ModelSerializer):
	class Meta:
		model = ModbusDeviceParameters
		exclude = ['id', 'device']


class DeviceSerializer(serializers.ModelSerializer):
	modbus_parameters = ModbusDeviceParametersSerializer()

	class Meta:
		model = Device
		fields = (
			'id', 
			'name', 
			'polling_period',
			'modbus_parameters', 
		)

class TagValueSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tag
		fields = ('code', 'name', 'data_type', 'value')
