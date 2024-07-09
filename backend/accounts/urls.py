from django.urls import path

from .views import (
    CadastrarAPIView,
    UserDetailAPIView,
    SearchUserAPIView,
    UserUpdateAPIView,
    # SearchUsersAPIView
)

urlpatterns = [
    path("cadastrar/", CadastrarAPIView.as_view(), name="cadastrar"),
    path("user-detail/", UserDetailAPIView.as_view(), name="user-detail"),
    path(
        "user-detail/<str:username>/", SearchUserAPIView.as_view(), name="user-detail"
    ),
    path("user-update/", UserUpdateAPIView.as_view(), name="user-update"),
]

