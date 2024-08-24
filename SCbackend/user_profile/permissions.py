from rest_framework import permissions
from .models import User


class IsProfileOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permissions for User view to only allow
    user to edit their own profile. Otherwise, Get and Post Only.
    """

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_anonymous:
            return request.user == obj

        return False
