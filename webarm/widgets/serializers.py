from rest_framework import serializers

from .models import WidgetsTemplate



class WidgetsTemplateSerializer(serializers.ModelSerializer):
    template = serializers.JSONField()
    class Meta:
        model = WidgetsTemplate
        fields = ('template', )





