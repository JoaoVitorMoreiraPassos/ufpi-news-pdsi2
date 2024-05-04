from django.contrib import admin

from .models import Post, Comentario, Favorito


class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo_post', 'autor_post', 'ativo')
    list_display_links = ('id', 'titulo_post')
    search_fields = ('titulo_post', 'autor_post__username')
    list_filter = ('autor_post', 'ativo')
    list_editable = ('ativo',)
    list_per_page = 10


admin.site.register(Post, PostAdmin)


class ComentarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'post_comentario', 'autor_comentario', 'ativo')
    list_display_links = ('id', 'post_comentario')
    search_fields = ('post_comentario__titulo_post',
                     'autor_comentario__username')
    list_filter = ('autor_comentario', 'ativo')
    list_editable = ('ativo',)
    list_per_page = 10


admin.site.register(Comentario, ComentarioAdmin)


class FavoritoAdmin(admin.ModelAdmin):
    list_display = ('id', 'post_favorito', 'autor_favorito')
    list_display_links = ('id', 'post_favorito')
    search_fields = ('post_favorito__titulo_post',
                     'autor_favorito__username')
    list_filter = ('autor_favorito',)
    list_per_page = 10


admin.site.register(Favorito, FavoritoAdmin)
