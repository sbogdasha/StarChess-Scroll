from rest_framework import serializers
from user_profile.models import User
from .models import PVPGameStats, PVCGameStats


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['wallet_address', 'score', 'profile_pic_num']


class PVPGameStatsSerializer(serializers.ModelSerializer):
    winner = UserSerializer(many=True)
    loser = UserSerializer(many=True)

    class Meta:
        model = PVPGameStats
        fields = ['game_date', 'winner', 'loser']


class PVCGameStatsSerializer(serializers.ModelSerializer):
    player = UserSerializer(many=True)

    class Meta:
        model = PVCGameStats
        fields = ['player', 'game_date', 'is_winner']
