from django.urls import path

from .views import (
    PostsAPIView,
    PostAPIView,
    SearchPostByAutorAPIView,
)

urlpatterns = [
    path("posts/", PostsAPIView.as_view(), name="posts"),
    path("posts/<int:pk>/", PostAPIView.as_view(), name="post"),
    path("posts/search/<str:search>/", SearchPostByAutorAPIView.as_view(), name="search"),
]
