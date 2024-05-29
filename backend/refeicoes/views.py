from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import (
    Alimento,
    Cardapio
)
from .serializers import (
    AlimentoSerializer,
    CardapioSerializer
)

from .permissions import HasRefeicaoPermissions

# class AlimentosPagination(PageNumberPagination):
#     page_size = 1000


class AlimentosAPIView(generics.ListCreateAPIView):
    queryset = Alimento.objects.all()
    serializer_class = AlimentoSerializer
    # Tirar a paginação desse endpoint
    pagination_class = None
    permission_classes = [HasRefeicaoPermissions,]

class AlimentoAPIView(generics.RetrieveDestroyAPIView):
    queryset = Alimento.objects.all()
    serializer_class = AlimentoSerializer
    permission_classes = [HasRefeicaoPermissions, ]

class CardapiosAPIView(generics.ListCreateAPIView):
    queryset = Cardapio.objects.all()
    serializer_class = CardapioSerializer
    permission_classes = [HasRefeicaoPermissions, ]
    pagination_class = None

    def get_queryset(self):
        return Cardapio.objects.filter(ativo=True)

    def create(self, request, *args, **kwargs):
        # Verificar se já existem dois Cardapios na mesma data
        data = request.data.get('data')
        if Cardapio.objects.filter(data=data).count() >= 2:
            return Response(
                {"message": "Já existem dois cardápios cadastrados para esta data."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().create(request, *args, **kwargs)


class CardapioAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cardapio.objects.all()
    serializer_class = CardapioSerializer
    permission_classes = [HasRefeicaoPermissions, ]