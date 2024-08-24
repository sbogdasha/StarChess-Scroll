from rest_framework import serializers
from user_profile.models import User


class UserSerializer(serializers.ModelSerializer):
    daily_score = serializers.FloatField(required=False)
    monthly_score = serializers.FloatField(required=False)

    class Meta:
        model = User
        fields = ['wallet_address', 'score', 'profile_pic_num', 'daily_score', 'monthly_score']


class TopUsersSerializer(serializers.Serializer):
    users = UserSerializer(many=True)
    current_user = UserSerializer()
    current_user_position = serializers.IntegerField()

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # Add position numbers to each user in the top list
        top_users = data['users']
        for i, user_data in enumerate(top_users, start=1):
            user_data['position'] = i

        return data
