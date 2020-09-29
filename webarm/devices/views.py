from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response

counter = 0

class DeviceDataView(APIView):
	def get(self, request, *args, **kwargs):
		global counter
		counter += 0.01 
		
		data = {
			'name': 'БУМ-11',
			'tags': {
				'temp1':13.8 + counter,
				'temp2':22.3 + counter,
				'temp3':15.1 + counter,
				'temp4':11.7 + counter
			}
		}		
		return Response(data)


