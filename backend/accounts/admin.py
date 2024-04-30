from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name',
                    'email', 'is_staff', 'foto_perfil', 'post_permissoes', 'refeicao_permissoes')
    list_display_links = ('id', 'username', 'first_name', 'last_name',
                          'email', 'foto_perfil')
