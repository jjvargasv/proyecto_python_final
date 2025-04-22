from django.db import models
from django.conf import settings
from products.models import Product

# Modelos para la gestión del carrito de compras

# Modelo principal de carrito, asociado a un usuario
class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')  # Usuario propietario del carrito
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación del carrito
    updated_at = models.DateTimeField(auto_now=True)  # Fecha de última actualización

    def __str__(self):
        # Representación legible del carrito
        return f"Carrito de {self.user.username}"

# Modelo para los ítems/productos dentro del carrito
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')  # Carrito al que pertenece el ítem
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Producto agregado al carrito
    quantity = models.PositiveIntegerField(default=1)  # Cantidad de este producto en el carrito
    added_at = models.DateTimeField(auto_now_add=True)  # Fecha de agregado

    class Meta:
        unique_together = ('cart', 'product')  # Un producto no puede repetirse en el mismo carrito

    def __str__(self):
        # Representación legible del ítem
        return f"{self.quantity} x {self.product.name}"
