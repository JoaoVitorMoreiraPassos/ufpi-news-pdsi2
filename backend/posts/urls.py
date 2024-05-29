from django.urls import path

from .views import (
    PostsAPIView,
    PostAPIView,
    SearchPostByAutorAPIView,
    ComentariosAPIView,
    ComentarioAPIView
)

urlpatterns = [
    path("posts/", PostsAPIView.as_view(), name="posts"),
    path("posts/<int:pk>/", PostAPIView.as_view(), name="post"),
    path("posts/search/<str:search>/", SearchPostByAutorAPIView.as_view(), name="search"),

    path("posts/<int:post_pk>/comentarios/", ComentariosAPIView.as_view(), name="comentarios"),
    path("posts/<int:post_pk>/comentarios/<int:pk>/", ComentarioAPIView.as_view(), name="comentario"),


]
