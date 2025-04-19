from django.contrib import admin
from .models import SuscriptorBoletin

@admin.register(SuscriptorBoletin)
class SuscriptorBoletinAdmin(admin.ModelAdmin):
    list_display = ("email", "fecha_suscripcion")
    search_fields = ("email",)
    list_filter = ("fecha_suscripcion",)
    ordering = ("-fecha_suscripcion",)
