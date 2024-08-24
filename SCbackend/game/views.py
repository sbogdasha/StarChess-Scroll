from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import PVPGameStats, PVCGameStats
from user_profile.models import User
from .serializers import PVPGameStatsSerializer, PVCGameStatsSerializer


GAME_REWARD_POINTS_AMOUNT = 1
GAME_PENALTY_POINTS_AMOUNT = -1
GAME_TIE_POINTS_AMOUNT = 0


class PVPGameStatsView(APIView):

    def post(self, request, *args, **kwargs):
        winner_wallet_address = request.data.get('winner_wallet_address')
        loser_wallet_address = request.data.get('loser_wallet_address')

        winner = User.objects.get(wallet_address=winner_wallet_address)
        loser = User.objects.get(wallet_address=loser_wallet_address)

        winner.add_points(GAME_REWARD_POINTS_AMOUNT)
        loser.add_points(GAME_PENALTY_POINTS_AMOUNT)

        winner.save()
        loser.save()

        game_stats = PVPGameStats.objects.create()
        game_stats.winner.add(winner)
        game_stats.loser.add(loser)

        serializer = PVPGameStatsSerializer(game_stats)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PVCGameStatsView(APIView):

    def post(self, request, *args, **kwargs):
        player_wallet_address = request.data.get('player_wallet_address')
        is_winner = request.data.get('is_winner')

        player = User.objects.get(wallet_address=player_wallet_address)

        if is_winner == 'True':
            player.add_points(GAME_REWARD_POINTS_AMOUNT)
        elif is_winner == 'False':
            player.add_points(GAME_PENALTY_POINTS_AMOUNT)
        else:
            player.add_points(GAME_TIE_POINTS_AMOUNT)

        player.save()

        game_stats = PVCGameStats.objects.create(is_winner=is_winner)
        game_stats.player.add(player)

        serializer = PVCGameStatsSerializer(game_stats)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

