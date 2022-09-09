from django.urls import path

from .con_rest import RestApiConnectorView


urlpatterns = [
     path('rest-api-1/', RestApiConnectorView.as_view()),
]
