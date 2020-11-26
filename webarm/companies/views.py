from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import Company
from facilities.models import Facility
from devices.models import Device

class CompanyInfoView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user

        company = get_object_or_404(Company, owner=user)
        facilities = Facility.objects.filter(company=company)
        devices = {}
        for f in facilities:
            devices[f.id] = Device.objects.filter(facility=f)

        data = {}
        data['company'] = {
            'id': company.id,
            'name': company.name
        }

        data['facilities'] = [{
            'id': f.id,
            'name': f.name, 
            'devices': [{
                'id': d.id, 
                'name': d.name, 
            } for d in devices[f.id]]
        } for f in facilities]

        return Response(data, status=status.HTTP_200_OK)
