from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import json, os

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

class TestDataView(APIView):
	def get(self, request, *args, **kwargs):
		data = {}
		path = os.path.join(settings.BASE_DIR, 'devices/com_test/GET.json')
		print(path)
		with open(path, 'r', encoding='utf-8') as file:
			data = json.load(file)	
		return Response(data, status=status.HTTP_200_OK)

	def post(self, request, *args, **kwargs):
		data = {}
		path = os.path.join(settings.BASE_DIR, 'devices/com_test/POST.json')
		with open(path, 'r', encoding='utf-8') as file:
			data = json.load(file)	
		return Response(data, status=status.HTTP_201_CREATED)