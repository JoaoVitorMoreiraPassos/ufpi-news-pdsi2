"""
URL configuration for ufpi_news project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/v1/", include("accounts.urls")),
    path("api/v1/", include("posts.urls")),

    # A rota para redefinir a senha é api/v1/users/reset_password/
    # A rota para confirmar a redefinição de senha é api/v1/users/reset_password_confirm/
    path("api/v1/", include("djoser.urls")),
    path("api/v1/", include("djoser.urls.jwt")),

    # Rota para gerar o token é api/v1/jwt/create/
    # Rota para atualizar o token é api/v1/jwt/refresh/
    # Rota para verificar o token é api/v1/jwt/verify/ (Essa aqui nem precisa usar, mas já vem com a biblioteca)
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)