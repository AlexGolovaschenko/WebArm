from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from .models import Company
from .serializers import CompanyParametersSerializer
from facilities.models import Facility
from devices.models import Device

class CompanyInfoView(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        company = get_object_or_404(Company, owner=user)
        facilities = Facility.objects.filter(company=company).order_by('name')
        devices = {}
        for f in facilities:
            devices[f.id] = Device.objects.filter(facility=f).order_by('name')

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


    def post(self, request, *args, **kwargs):
        user = request.user
        try:
            # update
            company = Company.objects.get(owner=user)
            serializer = CompanyParametersSerializer(company, data=request.data)    
        except Company.DoesNotExist:
            # create
            request.data['owner'] = user.id
            serializer = CompanyParametersSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

 
