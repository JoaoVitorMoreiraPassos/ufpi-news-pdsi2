from rest_framework import generics, status, permissions

# from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

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
    # Comentario,
    # Favorito
)
from .serializers import (
    PostSerializer,
    # ComentarioSerializer,
    # FavoritoSerializer
)


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


class SearchAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        search = self.kwargs.get("search")
        return self.queryset.filter(titulo_post__icontains=search)


class SearchPostByAutorAPIView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        search = self.kwargs.get("search")
        return self.queryset.filter(autor_post__post_permissoes=True).filter(
            autor_post__username=search
        )
