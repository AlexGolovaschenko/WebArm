from django.urls import path

from .views import WidgetsTemplateView


app_name = 'widgets'
urlpatterns = [
    path('template/', WidgetsTemplateView.as_view()),
]
