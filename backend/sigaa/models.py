from django.db import models
from accounts.models import User
# Create your models here.

class UserCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matricula = models.CharField(max_length=255, unique=True, verbose_name='Matricula')
    senha = models.CharField(max_length=255, verbose_name='Senha')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data de Atualização')

    def __str__(self):
        return self.user.username
    

class Materia(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255, verbose_name='Nome')
    codigo = models.CharField(max_length=255, verbose_name='Código')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data de Atualização')
    ativo = models.BooleanField(default=True, verbose_name='Ativo')
    
    def __str__(self):
        return self.nome
    

class Tarefa(models.Model):
    materia = models.ForeignKey(Materia, on_delete=models.CASCADE)
    titulo = models.CharField(max_length=255, verbose_name='Título')
    descricao = models.TextField(verbose_name='Descrição')
    data_entrega = models.DateField(verbose_name='Data de Entrega')
    data_criacao = models.DateField(auto_now_add=False, verbose_name='Data de Criação')
    documento = models.FileField(upload_to='documentos/', verbose_name='Documento', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data de Atualização')

    def __str__(self):
        return self.titulo
    
