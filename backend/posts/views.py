from rest_framework import generics, status, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import action

# from rest_framework.generics import get_object_or_404
from rest_framework.permissions import (
    IsAuthenticated,
    DjangoModelPermissions,
    IsAuthenticatedOrReadOnly,
)

from .permissions import HasPostPermissions  # Permission customizada

from django.contrib.auth import get_user_model

from .models import (
    Post,
    Comentario,
    Favorito
)
from .serializers import (
    PostSerializer,
    ComentarioSerializer,
    FavoritoSerializer
)

# API version 2
class PostsViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [HasPostPermissions, ]

    def create(self, request, *args, **kwargs):
        # Adicionar o autor do post automaticamente
        request.data["autor_post"] = request.user.id
        serializer: PostSerializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                "message": "Post cadastrado com sucesso!",
                "post": serializer.data,
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )
    
    def get_queryset(self):
        search = self.request.query_params.get("search")
        if search:
            return self.queryset.filter(autor_post__post_permissoes=True, autor_post__username=search)
        return self.queryset
    # @action(detail=False, methods=['get'], url_path='search/(?P<search>[^/.]+)')
    # def search_by_author(self, request, search=None):
        # queryset = self.queryset.filter(autor_post__post_permissoes=True, autor_post__username=search)
        # serializer = self.get_serializer(queryset, many=True)
        # return Response(serializer.data)


# -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# API version 1

class PostsAPIView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [HasPostPermissions, ]

    def create(self, request, *args, **kwargs):
        # Adicionar o autor do post automaticamente
        request.data["autor_post"] = request.user.id
        serializer: PostSerializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            headers = self.get_success_headers(serializer.data)

            return Response(
                {
                    "message": "Post cadastrado com sucesso!",
                    "post": serializer.data,
                },
                status=status.HTTP_201_CREATED,
                headers=headers,
            )


class PostAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [HasPostPermissions, ]



# Procurar posts por autor que tenha permissões para fazer postagens
class SearchPostByAutorAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        search = self.kwargs.get("search")
        return self.queryset.filter(
            autor_post__post_permissoes=True,
            autor_post__username=search
        ) | self.queryset.filter(
            autor_post__is_superuser=True,
            autor_post__username=search
        )
    
class ComentariosPagination(PageNumberPagination):
    page_size = 8

class ComentariosAPIView(generics.ListCreateAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer
    pagination_class = ComentariosPagination
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    def get_queryset(self):
        if self.kwargs.get("post_pk"):
            return self.queryset.filter(post_comentario_id=self.kwargs.get("post_pk")).order_by("-id")

        return self.queryset.all()

    def create(self, request, *args, **kwargs):
        serializer: ComentarioSerializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Verificar se o id passado é igual ao do usuário logado
            if request.user.id == serializer.validated_data.get("autor_comentario").id:
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(
                    {
                        "message": "Comentário cadastrado com sucesso!",
                        "comentario": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                    headers=headers,
                )
            else:
                return Response(
                    {"message": "O id do usuário não corresponde ao autor do comentário."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        return Response(
            {"message": "Erro ao cadastrar comentário!", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
class ComentarioAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

