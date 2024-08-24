from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, timedelta
from django.db.models import Sum, F, ExpressionWrapper, fields
from django.db.models.functions import TruncMonth, TruncDay
from user_profile.models import User
from game.models import PVPGameStats, PVCGameStats
from .serializers import TopUsersSerializer, UserSerializer


class DailyTopUsersView(APIView):
    def get(self, request, *args, **kwargs):
        permission_classes = [IsAuthenticated]

        users = User.objects.all()
        top_users = sorted(users, key=lambda user: user.calculate_daily_score(), reverse=True)[:10]

        # Get the current user's position, score, daily score
        current_user = users.filter(wallet_address=request.user.wallet_address).first()
        current_user_position = sorted(users, key=lambda user: user.calculate_daily_score(),
                                       reverse=True).index(current_user) + 1
        current_user_score = current_user.score
        current_user_daily_score = current_user.calculate_daily_score()

        # Calculate daily scores for each user in the top list
        top_users_data = []
        for user in top_users:
            daily_score = user.calculate_daily_score()
            top_users_data.append({
                'wallet_address': user.wallet_address,
                'score': user.score,
                'profile_pic_num': user.profile_pic_num,
                'daily_score': daily_score,
            })

        serializer = TopUsersSerializer({
            'users': top_users_data,
            'current_user': {
                'wallet_address': current_user.wallet_address,
                'score': current_user_score,
                'profile_pic_num': current_user.profile_pic_num,
                'daily_score': current_user_daily_score,
            },
            'current_user_position': current_user_position
        })

        return Response(serializer.data, status=status.HTTP_200_OK)


class MonthlyTopUsersView(APIView):
    def get(self, request, *args, **kwargs):
        permission_classes = [IsAuthenticated]

        users = User.objects.all()
        top_users = sorted(users, key=lambda user: user.calculate_monthly_score(), reverse=True)[:10]

        # Get the current user's position, score, monthly score
        current_user = users.filter(wallet_address=request.user.wallet_address).first()
        current_user_position = sorted(users, key=lambda user: user.calculate_monthly_score(),
                                       reverse=True).index(current_user) + 1
        current_user_score = current_user.score
        current_user_monthly_score = current_user.calculate_monthly_score()

        # Calculate monthly scores for each user in the top list
        top_users_data = []
        for user in top_users:
            monthly_score = user.calculate_monthly_score()
            top_users_data.append({
                'wallet_address': user.wallet_address,
                'score': user.score,
                'profile_pic_num': user.profile_pic_num,
                'monthly_score': monthly_score,
            })

        serializer = TopUsersSerializer({
            'users': top_users_data,
            'current_user': {
                'wallet_address': current_user.wallet_address,
                'score': current_user_score,
                'profile_pic_num': current_user.profile_pic_num,
                'monthly_score': current_user_monthly_score,
            },
            'current_user_position': current_user_position
        })

        return Response(serializer.data, status=status.HTTP_200_OK)


