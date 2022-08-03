from rest_framework import serializers

from .models import Company


class CompanyParametersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('name', 'owner')

