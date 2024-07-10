from django.db import models
from django.conf import settings
from PIL import Image


class Base(models.Model):
    criacao = models.DateTimeField(auto_now_add=True)
    atualizacao = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True, verbose_name='Ativo')

    class Meta:
        abstract = True


class Post(Base):
    titulo_post = models.CharField(max_length=255, verbose_name='Titulo')
    autor_post = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, verbose_name='Autor')
    conteudo_post = models.TextField(verbose_name='Conteudo')
    imagem_post = models.ImageField(
        upload_to='post_img/%Y/%m/%d', blank=True, null=True, verbose_name='Imagem')

    class Meta:
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
        ordering = ['-id']

    def __str__(self):
        return self.titulo_post

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.imagem_post:
            img = Image.open(self.imagem_post.path)
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size)
                img.save(self.imagem_post.path)


class Comentario(Base):
    post_comentario = models.ForeignKey(
        Post, related_name='comentarios', on_delete=models.CASCADE, verbose_name='Post')
    autor_comentario = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, verbose_name='Autor')
    conteudo_comentario = models.TextField(verbose_name='Conteudo')

    class Meta:
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'
        ordering = ['id']

    def __str__(self):
        return self.conteudo_comentario


class Favorito(Base):
    post_favorito = models.ForeignKey(
        Post, related_name='favoritos', on_delete=models.CASCADE, verbose_name='Post')
    autor_favorito = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name='Autor')

    class Meta:
        verbose_name = 'Favorito'
        verbose_name_plural = 'Favoritos'
        ordering = ['id']
        # impede que um usuario favorite um post mais de uma vez
        unique_together = ['post_favorito', 'autor_favorito']

