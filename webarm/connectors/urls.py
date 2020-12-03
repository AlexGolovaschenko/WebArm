from django.urls import path

from .views import (
    ModbusDeviceView,
)

app_name = 'connector'
urlpatterns = [
    path('http-api/', ModbusDeviceView.as_view()),
]
