from django.contrib import admin
from .models import Category, Product, Review, ProductImage

# Configuración del panel de administración para productos, categorías, imágenes y reseñas

# Clase para agregar imágenes adicionales a un producto desde la página de administración
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1  # Número de formularios adicionales por defecto para agregar imágenes

# Configuración personalizada para el modelo Product en el admin
# Esta clase define la forma en que se mostrarán y gestionarán los productos en el panel de administración
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Permite agregar y gestionar imágenes adicionales desde la página del producto
    inlines = [ProductImageInline]  
    # Columnas visibles en la lista de productos
    list_display = ("name", "price", "stock", "category", "featured")  
    # Campos de búsqueda para productos
    search_fields = ("name", "description", "detalles")  
    # Filtros laterales para productos
    list_filter = ("category", "featured")  
    # Campos solo lectura para productos
    readonly_fields = ("created_at", "updated_at")  
    # Agrupación de campos en la página de edición de productos
    fieldsets = (
        (None, {
            "fields": ("name", "description", "detalles", "price", "stock", "image", "category", "featured")
        }),
        ("Fechas", {
            "fields": ("created_at", "updated_at")
        })
    )

# Registro simple para los demás modelos en el admin
# Estos registros permiten gestionar categorías, reseñas e imágenes adicionales desde el panel de administración
admin.site.register(Category)  # Permite gestionar categorías desde el admin
admin.site.register(Review)    # Permite gestionar reseñas desde el admin
admin.site.register(ProductImage)  # Permite gestionar imágenes adicionales desde el admin
