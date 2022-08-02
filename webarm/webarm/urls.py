from django.contrib import admin
from django.urls import path, include

from .views import home_page_view

urlpatterns = [
    path('', home_page_view),
    path('engine-admin-site/', admin.site.urls),
    path('device/', include('devices.urls')),
    path('company/', include('companies.urls')),
    path('user/', include('users.urls')),
    path('connector/', include('connectors.urls')),
    path('widgets/', include('widgets.urls')),
    path('events/', include('eventslogs.urls')),

    # path('api-auth/', include('rest_framework.urls')),
]
