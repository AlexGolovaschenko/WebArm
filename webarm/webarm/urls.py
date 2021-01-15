from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('device/', include('devices.urls')),
    path('company/', include('companies.urls')),
    path('user/', include('users.urls')),
    path('connector/', include('connectors.urls')),
    path('widgets/', include('widgets.urls')),

    # path('api-auth/', include('rest_framework.urls')),
]
