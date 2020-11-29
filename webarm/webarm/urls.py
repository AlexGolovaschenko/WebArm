from django.contrib import admin
from django.urls import path, include

from devices import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('device/', include('devices.urls')),
    path('api/v1/', include('devices.urls')), #TODO: delte this row
    path('company/', include('companies.urls')),
    path('user/', include('users.urls')),

    # path('api-auth/', include('rest_framework.urls')),
]
