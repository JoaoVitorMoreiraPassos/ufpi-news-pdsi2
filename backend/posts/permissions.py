from rest_framework import permissions

class HasPostPermissions(permissions.BasePermission):
    """
    Custom permission to only allow users with post_permissoes=True to POST, UPDATE and DELETE
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            # Para GET, OPTIONS e HEAD, qualquer usuário pode acessar
            return True
        else:
            # Para POST, UPDATE e DELETE, o usuário precisa ter a permissão post_permissoes=True
            return request.user.is_authenticated and (request.user.post_permissoes or request.user.is_superuser)
