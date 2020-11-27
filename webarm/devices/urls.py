from django.urls import path

from .views import (
    DeviceParametersView, 
    DeviceTagsParametersView,
    DeviceTagsCurrentValueView,
    DeviceTagsHistoricalValueView,
    ModbusDeviceView,
)

app_name = 'device'
urlpatterns = [
    path('parameters/', DeviceParametersView.as_view(), name='parameters'),
    path('tags/parameters/', DeviceTagsParametersView.as_view()),
    path('tags/value/', DeviceTagsCurrentValueView.as_view()),
    path('tags/history/', DeviceTagsHistoricalValueView.as_view()),

    path('modbus-device/', ModbusDeviceView.as_view()),

]
