from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    ListAPIView,
)

from .serializers import (
    UserSerializer,
    UserDetailSerializer,
    UserUpdateSerializer
)

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response
from rest_framework import status, serializers
from django.contrib.auth import get_user_model
from rest_framework.pagination import PageNumberPagination



class CadastrarAPIView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(user.password)
            user.save()
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"message": "Usuário cadastrado com sucesso!", "user": serializer.data},
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        return Response(
            {"message": "Erro ao cadastrar usuário!", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

class UserUpdateAPIView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs): # Isso faz 
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class UserDetailAPIView(RetrieveAPIView):
    serializer_class = UserDetailSerializer
    # authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class SearchUserAPIView(RetrieveAPIView):
    serializer_class = UserDetailSerializer

    def get_object(self):
        username = self.kwargs.get("username")
        return get_user_model().objects.get(username=username)

class SearchUsersPagination(PageNumberPagination):
    page_size = 8

class SearchUsersAPIView(ListAPIView):
    serializer_class = UserDetailSerializer
    pagination_class = SearchUsersPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return get_user_model().objects.filter(username__icontains=username).order_by("id")