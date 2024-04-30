from django.urls import path

from .views import (
    CadastrarAPIView, 
    UserDetailAPIView, 
    # UserUpdateAPIView, 
    # SearchUserAPIView, 
    # SearchUsersAPIView
)

urlpatterns = [
    path("cadastrar/", CadastrarAPIView.as_view(), name="cadastrar"),
    path("user-detail/", UserDetailAPIView.as_view(), name="user-detail"),
]
