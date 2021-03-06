from django.urls import path

from .views import (
    DeviceParametersView, 
    ModbusDeviceParametersView,
    DeviceTagsParametersView,
    DeviceTagsCurrentValueView,
    DeviceTagsHistoricalValueView,
)

app_name = 'device'
urlpatterns = [
    path('parameters/', DeviceParametersView.as_view()),
    path('modbus/parameters/', ModbusDeviceParametersView.as_view()),
    path('tags/parameters/', DeviceTagsParametersView.as_view()),
    path('tags/value/', DeviceTagsCurrentValueView.as_view()),
    path('tags/history/', DeviceTagsHistoricalValueView.as_view()),
]
