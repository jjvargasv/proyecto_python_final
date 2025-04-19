from django.contrib import admin
from .models import MensajeContacto

@admin.register(MensajeContacto)
class MensajeContactoAdmin(admin.ModelAdmin):
    list_display = ("nombre", "email", "fecha")
    search_fields = ("nombre", "email", "mensaje")
    readonly_fields = ("fecha",)
    list_filter = ("fecha",)
    ordering = ("-fecha",)
