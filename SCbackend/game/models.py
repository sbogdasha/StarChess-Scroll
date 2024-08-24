from django.db import models
# from django.contrib.auth.models import User
from user_profile.models import User


class PVPGameStats(models.Model):
    # player1 = models.ManyToManyField(User, verbose_name='Player 1', related_name='player1')
    # player2 = models.ManyToManyField(User, verbose_name='Player 2', related_name='player2')
    game_date = models.DateTimeField(auto_now_add=True, verbose_name="Date of the game")
    winner = models.ManyToManyField(User, verbose_name='Game winner', related_name='winner', blank=True)
    loser = models.ManyToManyField(User, verbose_name='Game loser', related_name='loser', blank=True)

    class Meta:
        verbose_name = 'Game statistics'
        verbose_name_plural = 'Games statistics'

    def __str__(self):
        return 'Game between {} and {}'.format(self.player1, self.player2)


class PVCGameStats(models.Model):

    player = models.ManyToManyField(User, verbose_name='Player')
    game_date = models.DateTimeField(auto_now_add=True, verbose_name="Date of the game")
    is_winner = models.BooleanField(verbose_name='Game winner')

    class Meta:
        verbose_name = 'PvC game statistics'
        verbose_name_plural = 'PvC games statistics'

    def __str__(self):
        return 'Game between {} and computer'.format(self.player)

