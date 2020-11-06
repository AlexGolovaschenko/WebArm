from django.urls import path

from .views import (
    DeviceParametersView, 
    DeviceTagsParametersView,
    DeviceTagsCurrentValueView,
    ModbusDeviceView,
)

urlpatterns = [
    path('device/', DeviceParametersView.as_view(), name='device-data'),
    path('device/tags', DeviceTagsParametersView.as_view()),
    path('device/current-values', DeviceTagsCurrentValueView.as_view()),

    path('modbus-device/', ModbusDeviceView.as_view()),

]
