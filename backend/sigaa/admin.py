from django.contrib import admin

# Register your models here.

from .models import UserCredentials, Materia, Tarefa

admin.site.register(UserCredentials)
admin.site.register(Materia)
admin.site.register(Tarefa)
