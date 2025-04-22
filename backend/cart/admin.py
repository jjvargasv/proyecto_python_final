from django.contrib import admin
from .models import Cart, CartItem

# Configuración del panel de administración para el carrito y sus ítems

# Permite gestionar los ítems del carrito directamente desde la página del carrito
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

# Configuración personalizada para el modelo Cart en el admin
class CartAdmin(admin.ModelAdmin):
    inlines = [CartItemInline]  # Permite ver y editar ítems desde el carrito
    list_display = ('user', 'created_at', 'updated_at')  # Columnas visibles en la lista
    search_fields = ('user__username',)  # Permite buscar por usuario

# Registro de los modelos en el panel de administración
admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem)
