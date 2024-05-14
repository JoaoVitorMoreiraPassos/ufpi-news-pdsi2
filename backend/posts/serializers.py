from rest_framework import serializers
from .models import (
    Post,
)

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