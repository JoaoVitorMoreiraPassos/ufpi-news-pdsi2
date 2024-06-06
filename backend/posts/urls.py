from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PostsViewSet,
    PostsAPIView,
    PostAPIView,
    SearchPostByAutorAPIView,
    ComentariosAPIView,
    ComentarioAPIView
)


router = DefaultRouter()
router.register(r'posts', PostsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Assim dá certo(Testado)
    # path("posts2/", PostsViewSet.as_view({
    #         "get": "list",
    #         "post": "create"
    #     }), name="posts"),
    # path("posts2/<int:pk>/", PostsViewSet.as_view({
    #         "get": "retrieve",
    #         "put": "update",
    #         "delete": "destroy"
    #     }), name="post"),
    # path("posts2/search/<str:search>/", PostsViewSet.as_view({
    #         "get": "list"
    #     }), name="search"),

    path("posts/", PostsAPIView.as_view(), name="posts"),
    path("posts/<int:pk>/", PostAPIView.as_view(), name="post"),
    path("posts/search/<str:search>/", SearchPostByAutorAPIView.as_view(), name="search"),

    path("posts/<int:post_pk>/comentarios/", ComentariosAPIView.as_view(), name="comentarios"),
    path("posts/<int:post_pk>/comentarios/<int:pk>/", ComentarioAPIView.as_view(), name="comentario"),


]
