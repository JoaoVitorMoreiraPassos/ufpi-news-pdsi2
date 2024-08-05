from rest_framework import serializers
from .models import UserCredentials, Materia, Tarefa

# Create here your serializers

class CredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCredentials
        fields = [
            "user",
            "matricula",
            "senha",
        ]

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = [
            "id",
            "nome",
            "codigo",
            "created_at",
            "updated_at",
        ]

class TarefaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarefa
        fields = [
            "id",
            "titulo",
            "descricao",
            "data_entrega",
            "data_criacao",
            "materia",
            "created_at",
            "updated_at",
        ]