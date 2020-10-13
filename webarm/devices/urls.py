from django.urls import path

from .views import DeviceDataView, TestDataView, DeviceTagsCurrentValueView

urlpatterns = [
    path('device/', DeviceDataView.as_view(), name='device-data'),
    path('test/', TestDataView.as_view()),
    path('device/current-values', DeviceTagsCurrentValueView.as_view()),
]
