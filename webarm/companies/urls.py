from django.urls import path

from .views import CompanyInfoView


app_name = 'companies'
urlpatterns = [
    path('info/', CompanyInfoView.as_view(), name="info"),
]