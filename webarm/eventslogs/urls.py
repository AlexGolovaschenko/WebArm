from django.urls import path

from .views import EventsLogView, EventsConfigView



app_name = 'events'
urlpatterns = [
    path('log/', EventsLogView.as_view()),
    path('config/', EventsConfigView.as_view()),
]
