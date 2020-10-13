
from django.contrib import admin
from django.urls import path, include

from devices import views
from web import views as web_views

urlpatterns = [
    path('', web_views.home),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/v1/', include('devices.urls')),
]
