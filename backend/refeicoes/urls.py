from django.urls import path

from .views import (
    AlimentosAPIView,
    AlimentoAPIView,
    CardapiosAPIView,
    CardapioAPIView,
)

urlpatterns = [
    path("alimentos/", AlimentosAPIView.as_view(), name="refeicoes"),
    path("alimentos/<int:pk>/", AlimentoAPIView.as_view(), name="refeicao"),

    path("cardapios/", CardapiosAPIView.as_view(), name="cardapios"),
    path("cardapios/<int:pk>/", CardapioAPIView.as_view(), name="cardapio"),
]