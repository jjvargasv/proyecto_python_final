from django.contrib import admin
from .models import SuscriptorBoletin

# Configuración personalizada para el modelo SuscriptorBoletin en el panel de administración
@admin.register(SuscriptorBoletin)
class SuscriptorBoletinAdmin(admin.ModelAdmin):
    # Campos que se mostrarán en la lista de suscriptores
    list_display = ("email", "fecha_suscripcion")
    # Campos por los que se puede buscar suscriptores
    search_fields = ("email",)
    # Filtro lateral por fecha de suscripción
    list_filter = ("fecha_suscripcion",)
    # Orden descendente por fecha (los más recientes primero)
    ordering = ("-fecha_suscripcion",)
