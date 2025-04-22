from django.contrib import admin
from .models import MensajeContacto

# Configuración personalizada para el modelo MensajeContacto en el panel de administración
@admin.register(MensajeContacto)
class MensajeContactoAdmin(admin.ModelAdmin):
    # Campos que se mostrarán en la lista de mensajes
    list_display = ("nombre", "email", "fecha")
    # Campos por los que se puede buscar mensajes
    search_fields = ("nombre", "email", "mensaje")
    # Campos que solo se pueden leer
    readonly_fields = ("fecha",)
    # Filtro lateral por fecha de envío
    list_filter = ("fecha",)
    # Orden descendente por fecha (los más recientes primero)
    ordering = ("-fecha",)
