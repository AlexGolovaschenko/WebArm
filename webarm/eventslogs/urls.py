from django.urls import path

from .views import EventsLogView



app_name = 'events'
urlpatterns = [
    path('log/', EventsLogView.as_view()),
]
