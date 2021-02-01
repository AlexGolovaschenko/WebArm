from rest_framework import serializers

from .models import Log, Record, Event




class LogRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = ('message', 'date' )