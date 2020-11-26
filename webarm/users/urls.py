from django.urls import path
from rest_framework_simplejwt import views as jwt_views

from .views import UserCreate, UserInfo, CheckUserAuth, LogoutAndBlacklistRefreshTokenForUserView


app_name = 'users'
urlpatterns = [
    path('create/', UserCreate.as_view(), name="user_create"),
    path('info/', UserInfo.as_view(), name="user_info"),
    path('token/obtain/', jwt_views.TokenObtainPairView.as_view(), name='token_create'),  # override sjwt stock token
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('token/blacklist/', LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='token_blacklist'),    
    path('token/check/', CheckUserAuth.as_view(), name='token_check'),    
]