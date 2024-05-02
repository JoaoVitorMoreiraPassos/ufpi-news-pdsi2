from django.db import models
from PIL import Image
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField('Email Address', unique=True, blank=False, null=False)
    foto_perfil = models.ImageField(upload_to='fotos_perfil/', null=True, blank=True)
    post_permissoes = models.BooleanField(default=False, verbose_name='Permissao de Postagem')
    refeicao_permissoes = models.BooleanField(default=False, verbose_name='Permissao de Refeicao')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.foto_perfil:
            img = Image.open(self.foto_perfil.path)
            if img.height > 250 or img.width > 250:
                output_size = (250, 250)
                img.thumbnail(output_size)
                img.save(self.foto_perfil.path)
