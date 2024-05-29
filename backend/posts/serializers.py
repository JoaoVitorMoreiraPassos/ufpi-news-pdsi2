from rest_framework import serializers
from .models import (
    Post,
    Comentario,
    Favorito
)

class ComentarioSerializer(serializers.ModelSerializer):
    autor_comentario_nome = serializers.ReadOnlyField(source="autor_comentario.username")
    # autor_comentario_id = serializers.IntegerField(write_only=True)
    imagem_autor_comentario = serializers.SerializerMethodField() # Pega a imagem do autor do comentario da seguinte forma 

    class Meta:
        model = Comentario
        fields = (
            "id",
            "post_comentario",
            "autor_comentario",
            "autor_comentario_nome",
            "imagem_autor_comentario",
            "conteudo_comentario",
            "criacao",
            "ativo",
        )

    def get_imagem_autor_comentario(self, obj):
        if obj.autor_comentario.foto_perfil:
            return self.context["request"].build_absolute_uri(
                obj.autor_comentario.foto_perfil.url
            )
        else:
            # return self.context['request'].build_absolute_uri(static('path/to/default/image.jpg'))
            return None

class PostSerializer(serializers.ModelSerializer):
    
    autor_post_nome = serializers.ReadOnlyField(source="autor_post.username")
    autor_imagem_post = serializers.SerializerMethodField()

    # Mostra os comentarios do post
    comentarios = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "titulo_post",
            "autor_post",
            "autor_post_nome", # Nome do autor do post
            "autor_imagem_post",
            "conteudo_post",
            "imagem_post",
            "criacao",
            "ativo",
            "comentarios",
        )

    def get_autor_imagem_post(self, obj):
        if obj.autor_post.foto_perfil:
            return self.context["request"].build_absolute_uri(
                obj.autor_post.foto_perfil.url
            )
        else:
            # return self.context['request'].build_absolute_uri(static('path/to/default/image.jpg'))
            return None
        
class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = (
            "id",
            "post_favorito",
            "autor_favorito",
        )

    extra_kwargs = {"autor_favorito": {"read_only": True}}