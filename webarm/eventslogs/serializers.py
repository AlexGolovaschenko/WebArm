from rest_framework import serializers

from .models import Log, Record, Event




class LogRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('message', 'date' )



class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'device', 'categories', 'enable', 'expression', 'raise_message', 'fall_message', 'is_alarm', 'is_active', 'raise_time', 'used_tags')
        read_only_fields = ('id', 'is_alarm', 'is_active', 'raise_time', 'used_tags')
