from django.contrib import admin
from .models import Perfil

@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = (
        'user', 'nombre_completo', 'telefono', 'ciudad', 'pais', 'fecha_nacimiento',
        'genero', 'metodo_pago', 'actualizado',
    )
    search_fields = ('user__username', 'nombre_completo', 'telefono', 'ciudad', 'pais', 'facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp', 'telegram')
    readonly_fields = ('actualizado',)
    list_filter = ('genero', 'ciudad', 'pais', 'fecha_nacimiento', 'actualizado')
    fieldsets = (
        ('Datos Básicos', {
            'fields': ('user', 'nombre_completo', 'foto_perfil', 'biografia', 'fecha_nacimiento', 'genero', 'ciudad', 'pais', 'idioma')
        }),
        ('Contacto y Redes Sociales', {
            'fields': ('telefono', 'direccion', 'facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp', 'telegram')
        }),
        ('Preferencias', {
            'fields': ('preferencias', 'metodo_pago')
        }),
        ('Auditoría', {
            'fields': ('actualizado',)
        }),
    )
