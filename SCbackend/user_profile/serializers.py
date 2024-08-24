from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import User
from game.models import PVPGameStats, PVCGameStats


class ValidationMixIn:

    def validate_user(self, data):
        u_count = User.objects.filter(wallet_address=data.get('wallet_address')).count()
        if u_count == 1:
            return data
        else:
            raise serializers.ValidationError("Wrong wallet address")


class UserNestedSerializer(serializers.ModelSerializer, ValidationMixIn):

    wallet_address = serializers.CharField(read_only=True)
    profile_pic_num = serializers.IntegerField(read_only=True)
    score = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ['wallet_address', 'score', 'profile_pic_num']


class UserDetailSerializer(serializers.ModelSerializer, ValidationMixIn):

    wallet_address = serializers.CharField(read_only=True)
    profile_pic_num = serializers.IntegerField(required=False)
    score = serializers.FloatField(required=False)
    total_games = serializers.SerializerMethodField()
    total_wins = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['wallet_address', 'score', 'profile_pic_num', 'total_games', 'total_wins']

    def get_total_games(self, instance):
        return PVPGameStats.objects.filter(winner=instance).count() + PVPGameStats.objects.filter(
            loser=instance).count() + PVCGameStats.objects.filter(player=instance).count()

    def get_total_wins(self, instance):
        return PVPGameStats.objects.filter(winner=instance).count() + PVCGameStats.objects.filter(player=instance,
                                                                                                  is_winner=True).count()

    def update(self, instance, validated_data):
        instance.profile_pic_num = validated_data.get('profile_pic_num', instance.profile_pic_num)
        instance.score = validated_data.get('score', instance.score)
        instance.save()

        return instance


class RegisterSerializer(serializers.ModelSerializer):

    wallet_address = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    profile_pic_num = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['wallet_address', 'profile_pic_num']

    def create(self, validated_data):
        user = User.objects.create(
            wallet_address=validated_data['wallet_address'],
            profile_pic_num=validated_data['profile_pic_num'],
        )
        user.set_password(validated_data['wallet_address'])
        user.save()

        return user


class LoginSerializer(serializers.ModelSerializer):

    wallet_address = serializers.CharField(required=True)
    tokens = serializers.SerializerMethodField()

    def get_tokens(self, obj):
        user = User.objects.get(wallet_address=obj['wallet_address'])
        return {
            'refresh': user.get_tokens_for_user()['refresh'],
            'access': user.get_tokens_for_user()['access']
        }

    class Meta:
        model = User
        fields = ['wallet_address', 'profile_pic_num', 'tokens']

    def validate(self, attrs):
        wallet_address = attrs.get('wallet_address', '')
        user = User.objects.get(wallet_address=wallet_address)

        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')

        return{
            'wallet_address': user.wallet_address,
            'profile_pic_num': user.profile_pic_num,
            'tokens': user.get_tokens_for_user()
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_messages = {
        'bad_token': 'Token is expired or invalid'
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()

        except TokenError:
            self.fail('bad_token')