from django.urls import path

from .views import RestApiConnectorView


urlpatterns = [
     path('rest-api-1/', RestApiConnectorView.as_view()),
]
