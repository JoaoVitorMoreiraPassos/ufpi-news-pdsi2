from rest_framework import serializers

# from django.contrib.auth import get_user_model
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "foto_perfil",
            # "post_permissoes",
        ]
        extra_kwargs = {
            # "post_permissoes": {"read_only": True},
            "password": {"write_only": True},
        }


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "foto_perfil",
            "is_staff",
            "post_permissoes",
            "refeicao_permissoes",
        ]
        # extra_kwargs = {'password': {'write_only': True}}
