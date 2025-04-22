from django.db import models
from django.conf import settings

# Modelos para la aplicación de productos

# Modelo para categorías de productos
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Nombre único de la categoría
    description = models.TextField(blank=True)  # Descripción opcional de la categoría

    # Representación legible de la categoría
    def __str__(self):
        return self.name

# Modelo para productos
class Product(models.Model):
    name = models.CharField(max_length=200)  # Nombre del producto
    description = models.TextField(blank=True)  # Descripción breve
    detalles = models.TextField(blank=True, default='', verbose_name='Detalles de producto')  # Detalles adicionales
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Precio del producto
    stock = models.PositiveIntegerField()  # Cantidad disponible en inventario
    image = models.ImageField(upload_to='products/', blank=True, null=True)  # Imagen principal
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')  # Categoría asociada
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    updated_at = models.DateTimeField(auto_now=True)  # Fecha de última actualización
    featured = models.BooleanField(default=False)  # Indica si el producto es destacado
    views_count = models.PositiveIntegerField(default=0)  # Número de vistas

    # Representación legible del producto
    def __str__(self):
        return self.name

# Modelo para imágenes adicionales de productos
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')  # Producto relacionado
    image = models.ImageField(upload_to='products/')  # Imagen adicional
    alt = models.CharField(max_length=255, blank=True)  # Texto alternativo para accesibilidad

    # Representación legible de la imagen
    def __str__(self):
        return f"Imagen de {self.product.name}"

# Modelo para reseñas de productos
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')  # Producto reseñado
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Usuario que realiza la reseña
    rating = models.PositiveSmallIntegerField()  # Calificación (por ejemplo, de 1 a 5)
    comment = models.TextField(blank=True)  # Comentario opcional
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación de la reseña
    updated_at = models.DateTimeField(auto_now=True)  # Fecha de última actualización

    # Configuración de la clase
    class Meta:
        unique_together = ('product', 'user')  # Un usuario solo puede reseñar un producto una vez
        ordering = ['-created_at']  # Ordenar reseñas por fecha descendente

    # Representación legible de la reseña
    def __str__(self):
        return f"{self.rating}★ by {self.user.username} on {self.product.name}"
