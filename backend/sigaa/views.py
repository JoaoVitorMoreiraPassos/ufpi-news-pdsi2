from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, CreateAPIView, GenericAPIView
from cryptography.fernet import Fernet
# import encrypt and decrypt functions
from django.core.files.storage import FileSystemStorage
from django.core.files import File
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime
import requests
import json

from rest_framework import status

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

from .serializers import CredentialsSerializer, MateriaSerializer, TarefaSerializer
from .models import UserCredentials, Materia, Tarefa
from django.conf import settings
import os



SIGAA_KEY = settings.SIGAA_KEY

# Create your views here.
class CredentialsAPIView(CreateAPIView):
    # receive a user and password, ecrypt the password and save in the database
    authentication_classes = [JWTAuthentication]
    serializer_class = CredentialsSerializer
    permission_classes = [ IsAuthenticated ]
    

    def create(self, request, *args, **kwargs):
        cipher_suite = Fernet(SIGAA_KEY)
        data = request.data.copy()
        data["user"] = request.user.id
        password = cipher_suite.encrypt(data["senha"].encode())
        data["senha"] = password.decode()
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(
                    {"message": "Credenciais cadastradas com sucesso!", "user": serializer.data},
                    status=status.HTTP_201_CREATED,
                    headers=headers,
                )
            except IntegrityError as e:
                return Response(
                    {"message": "Erro ao salvar dados", "errors": str(e)},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"message": "Erro ao cadastrar credenciais!", "errors": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )


class MateriaAPIView(ListAPIView):
    # list all subjects
    serializer_class = MateriaSerializer
    permission_classes = [ IsAuthenticated ]

    def get_queryset(self):
        return Materia.objects.filter(user=self.request.user)
    

class TarefaAPIView(ListAPIView):
    # list all tasks
    serializer_class = TarefaSerializer
    permission_classes = [ IsAuthenticated ]

    def get_queryset(self):
        return Tarefa.objects.filter(materia__user=self.request.user)
    