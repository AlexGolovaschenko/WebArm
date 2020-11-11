from django.urls import path

from .views import (
    DeviceParametersView, 
    DeviceTagsParametersView,
    DeviceTagsCurrentValueView,
    DeviceTagsHistoricalValueView,
    ModbusDeviceView,
)

urlpatterns = [
    path('device/', DeviceParametersView.as_view(), name='device-data'),
    path('device/tags', DeviceTagsParametersView.as_view()),
    path('device/current-values', DeviceTagsCurrentValueView.as_view()),
    path('device/tags/history', DeviceTagsHistoricalValueView.as_view()),

    path('modbus-device/', ModbusDeviceView.as_view()),

]
