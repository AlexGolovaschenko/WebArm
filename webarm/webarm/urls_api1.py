from django.urls import path, include

from companies.views import CompanyInfoView
from devices.views import DeviceParametersView, ModbusDeviceParametersView
from devices.views import DeviceTagsParametersView, DeviceTagsCurrentValueView, DeviceTagsHistoricalValueView
from widgets.views import WidgetsTemplateView
from eventlogs.views import EventsLogView, EventsConfigView


urlpatterns = [
    path('company/info/', CompanyInfoView.as_view()),

    path('device/parameters/', DeviceParametersView.as_view()),
    path('device/modbus/parameters/', ModbusDeviceParametersView.as_view()),
    path('device/tags/parameters/', DeviceTagsParametersView.as_view()),
    path('device/tags/value/', DeviceTagsCurrentValueView.as_view()),
    path('device/tags/history/', DeviceTagsHistoricalValueView.as_view()),

    path('widgets/template/', WidgetsTemplateView.as_view()),
    path('events/log/', EventsLogView.as_view()),
    path('events/config/', EventsConfigView.as_view()),

    # path('api-auth/', include('rest_framework.urls')),
]

