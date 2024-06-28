from django.db import models
from django.core.exceptions import ValidationError

class Base(models.Model):
    ativo = models.BooleanField(default=True, verbose_name='Ativo')

    class Meta:
        abstract = True


class Alimento(Base):
    REFEICAO_TYPE = (
        ('N', 'Normal'),
        ('V', 'Vegetariana'),
        ('A', 'Acompanhamento'),
    )
    tipo_refeicao = models.CharField(
        max_length=1, choices=REFEICAO_TYPE, default='N')
    nome_refeicao = models.CharField(max_length=255, verbose_name='Nome')
    # data = models.DateField(verbose_name='Data')

    class Meta:
        verbose_name = 'Alimento'
        verbose_name_plural = 'Alimentos'
        ordering = ['id']

    def __str__(self):
        return self.nome_refeicao


class Cardapio(Base):
    CARDAPIO_TYPE = (
        ('A', 'Almoço'),
        ('J', 'Jantar'),
    )
    tipo = models.CharField(max_length=1, choices=CARDAPIO_TYPE, default='A')
    data = models.DateField(verbose_name='Data')
    alimentos = models.ManyToManyField(Alimento, related_name='cardapios')

    def save(self, *args, **kwargs):
        if not self.pk and Cardapio.objects.filter(data=self.data).count() >= 2:
            raise ValidationError(
                "Já existem dois cardápios cadastrados para esta data.")
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Cardapio'
        verbose_name_plural = 'Cardapios'
        ordering = ['data']
        unique_together = ['data', 'tipo']

    def __str__(self):
        return str(self.data)

