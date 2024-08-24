from django.urls import path
from .views import PVPGameStatsView, PVCGameStatsView

urlpatterns = [
    path('pvp/', PVPGameStatsView.as_view(), name='pvp-'),
    path('pvc/', PVCGameStatsView.as_view(), name='pvc'),

]
