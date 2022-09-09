from django.contrib import admin
from django.urls import path, include

from .views import home_page_view


urlpatterns = [
    path('', home_page_view),
    path('user/', include('users.urls')),
    path('engine-admin-site/', admin.site.urls),

    # connectors api (for communication with devices)
    path('connectors/', include('connectors.urls')),

    # backend api v1 (for frontend end e.t.c.)
    path('api-1/', include('webarm.urls_api1')),
]
