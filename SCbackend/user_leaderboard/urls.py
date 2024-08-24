from django.urls import path
from .views import DailyTopUsersView, MonthlyTopUsersView

urlpatterns = [
    path('daily-top-users/', DailyTopUsersView.as_view(), name='daily-top-users'),
    path('monthly-top-users/', MonthlyTopUsersView.as_view(), name='monthly-top-users'),
]