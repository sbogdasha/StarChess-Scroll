from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework import views
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import User
from .permissions import IsProfileOwnerOrReadOnly
from .serializers import UserDetailSerializer, RegisterSerializer, LoginSerializer, LogoutSerializer


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserProfileDetails(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, IsProfileOwnerOrReadOnly]
    serializer_class = UserDetailSerializer

    def get_object(self):
        obj = get_object_or_404(User, wallet_address=self.kwargs.get('wallet_address'))
        self.check_object_permissions(self.request, obj)
        return obj


class LogoutAPIView(views.APIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response("Successful logout", status=status.HTTP_204_NO_CONTENT)
