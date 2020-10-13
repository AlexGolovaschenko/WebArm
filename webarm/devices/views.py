from django.conf import settings
from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import DeviceSerializer, TagValueSerializer
from .models import Device, Tag

import json, os


class DeviceDataView(APIView):
	def get(self, request, *args, **kwargs):
		obj = Device.objects.first()
		serializer = DeviceSerializer(obj)
		return Response(serializer.data)


class DeviceTagsCurrentValueView(APIView):
	def get(self, request, *args, **kwargs):
		try:
			device_id = request.GET.device_id
			device = Device.objects.get(id=device_id)
		except:
			device = Device.objects.first()
		tags = Tag.objects.filter(device=device)
		data = TagValueSerializer(tags, many=True).data
		return Response(data, status=status.HTTP_200_OK)


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