from django.urls import path
from .views import CredentialsAPIView, MateriaAPIView, TarefaAPIView


urlpatterns = [
    path('sigaa/credentials/', CredentialsAPIView.as_view(), name='credentials'),
    path('sigaa/materia/', MateriaAPIView.as_view(), name='materia'),
    path('sigaa/tarefa/', TarefaAPIView.as_view(), name='tarefa'),
]