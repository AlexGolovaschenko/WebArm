from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import (
    Device, Tag, ModbusDeviceParameters, ModbusTagParameters,
    CurrentStringValue, CurrentIntValue, CurrentFloatValue, CurrentBooleanValue,
    HistoricalStringValue, HistoricalIntValue, HistoricalFloatValue, HistoricalBooleanValue,
) 
from . import choices

# ---------------------------------------------------------------------
# devices
class ModbusDeviceParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModbusDeviceParameters
        exclude = ['id', 'device']


class DeviceParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ('id', 'name', 'polling_period', 'timeout', 'last_update', 
            'verbose_last_update', 'is_online', 'connector', 'facility',
        )

        read_only_fields = ('id', 'last_update', 'verbose_last_update', 
            'is_online', 'connector', 'facility',
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
        fields = ('id', 'code', 'name', 'data_type', 'value', 
            'modbus_parameters',
        )

        # https://www.django-rest-framework.org/api-guide/validators/
        validators = [
            UniqueTogetherValidator(
                queryset = Tag.objects.all(),
                fields = ['code', 'device']
            )
        ]


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



class HistoricalIntValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalIntValue
        fields = ('add_date', 'value')

class HistoricalFloatValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalFloatValue
        fields = ('add_date', 'value')

class HistoricalStringValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalStringValue
        fields = ('add_date', 'value')

class HistoricalBooleanValuesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalBooleanValue
        fields = ('add_date', 'value')



def get_current_tag_value_serializer(tag):
    if tag.data_type == choices.WEBARM_DATA_TYPE_INT:
        return IntValueSerializer
    elif tag.data_type == choices.WEBARM_DATA_TYPE_FLOAT:
        return FloatValueSerializer
    elif tag.data_type == choices.WEBARM_DATA_TYPE_STRING:
        return StringValueSerializer       
    elif tag.data_type == choices.WEBARM_DATA_TYPE_BOOL:
        return BooleanValueSerializer        
    else:
        raise('Error: data type not supported')

def get_historical_tag_value_serializer(tag):
    if tag.data_type == choices.WEBARM_DATA_TYPE_INT:
        return HistoricalIntValuesSerializer
    elif tag.data_type == choices.WEBARM_DATA_TYPE_FLOAT:
        return HistoricalFloatValuesSerializer
    elif tag.data_type == choices.WEBARM_DATA_TYPE_STRING:
        return HistoricalStringValuesSerializer       
    elif tag.data_type == choices.WEBARM_DATA_TYPE_BOOL:
        return HistoricalBooleanValuesSerializer        
    else:
        raise('Error: data type not supported')