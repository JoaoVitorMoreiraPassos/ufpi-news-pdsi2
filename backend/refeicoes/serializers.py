from rest_framework import serializers

from .models import (
    Alimento, 
    # AlimentoAdicional, 
    Cardapio
)


class AlimentoSerializer(serializers.ModelSerializer):

    tipo_refeicao_nome = serializers.SerializerMethodField()

    class Meta:
        model = Alimento
        fields = (
            'id',
            'tipo_refeicao',
            'tipo_refeicao_nome',
            'nome_refeicao',
            'ativo',
        )
    
    # Retorna o nome do tipo de refeicao
    def get_tipo_refeicao_nome(self, obj):
        return obj.get_tipo_refeicao_display()


class CardapioSerializer(serializers.ModelSerializer):

    # alimentos = serializers.StringRelatedField(many=True)

    class Meta:
        model = Cardapio
        fields = (
            'id',
            'tipo',
            'data',
            'alimentos',
            'ativo',
        )
