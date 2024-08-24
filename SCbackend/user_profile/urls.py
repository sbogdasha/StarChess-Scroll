from django.urls import path, include

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views


urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('<str:wallet_address>/', views.UserProfileDetails.as_view(), name='user-details'),
    # path('logout/', views.LogoutAPIView.as_view(), name='logout'),
]
