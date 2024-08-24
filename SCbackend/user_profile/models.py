from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):

    def create_user(self, wallet_address, password=None, **extra_fields):
        if not wallet_address:
            raise ValueError(_("The wallet_address must be set"))

        user = self.model(wallet_address=wallet_address, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, wallet_address, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        return self.create_user(wallet_address, password, is_superuser=True, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    username = None
    wallet_address = models.CharField(unique=True, verbose_name='Wallet Address',
                                      max_length=100, null=False, blank=False)
    score = models.FloatField(default=0, verbose_name="User Score")
    registered = models.DateTimeField(auto_now_add=True, verbose_name="Registered")

    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    profile_nft_id = models.IntegerField(verbose_name="User profile nft id")
    is_profile_nft_minted = models.BooleanField(default=False)

    objects = CustomUserManager()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    USERNAME_FIELD = "wallet_address"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.wallet_address

    # add negative number if subtraction needed
    def add_points(self, point_amount):
        if self.score <= 0 and point_amount < 0:
            return None
        self.score += point_amount

    def calculate_daily_score(self):
        from .utilities import calculate_daily_score
        return calculate_daily_score(self)

    def calculate_monthly_score(self):
        from .utilities import calculate_monthly_score
        return calculate_monthly_score(self)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

