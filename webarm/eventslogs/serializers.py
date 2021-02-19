from rest_framework import serializers

from .models import Log, Record, Event
from .handle_user_expressions import is_expression_safe



class LogRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('message', 'date' )



class EventSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        if not is_expression_safe(attrs['expression']):
            raise serializers.ValidationError({"expression": "Формула некорректна или содержит запрещенные символы"})
        return attrs

    class Meta:
        model = Event
        fields = ('id', 'device', 'categories', 'enable', 'expression', 'raise_message', 'fall_message', 'is_alarm', 'is_active', 'raise_time', 'used_tags')
        read_only_fields = ('id', 'is_alarm', 'is_active', 'raise_time', 'used_tags')



