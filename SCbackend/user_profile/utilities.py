# utilities.py
from datetime import timedelta
from game.models import PVPGameStats, PVCGameStats
from game.views import GAME_REWARD_POINTS_AMOUNT, GAME_PENALTY_POINTS_AMOUNT
from django.utils import timezone


def calculate_daily_score(user):
    yesterday = timezone.now().date() - timedelta(days=1)
    return calculate_score(user, yesterday)


def calculate_monthly_score(user):
    first_day_of_month = timezone.now().date().replace(day=1)
    return calculate_score(user, first_day_of_month)


def calculate_score(user, date):
    daily_score = (
            PVPGameStats.objects.filter(winner=user, game_date__date=date).count() * GAME_REWARD_POINTS_AMOUNT +
            PVPGameStats.objects.filter(loser=user, game_date__date=date).count() * GAME_PENALTY_POINTS_AMOUNT +
            PVCGameStats.objects.filter(player=user, game_date__date=date,
                                        is_winner=True).count() * GAME_REWARD_POINTS_AMOUNT +
            PVCGameStats.objects.filter(player=user, game_date__date=date,
                                        is_winner=False).count() * GAME_PENALTY_POINTS_AMOUNT
    )
    return daily_score
