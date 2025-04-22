from django.db import models
from django.conf import settings
from products.models import Product

# Modelos para la gestión de órdenes y sus ítems

# Modelo principal de orden de compra
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),  # Orden creada pero no pagada
        ('paid', 'Pagada'),        # Orden pagada
        ('shipped', 'Enviada'),    # Orden enviada al cliente
        ('completed', 'Completada'), # Orden finalizada
        ('cancelled', 'Cancelada'),  # Orden cancelada
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')  # Usuario propietario de la orden
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación
    updated_at = models.DateTimeField(auto_now=True)  # Fecha de última actualización
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')  # Estado de la orden
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Total de la orden

    def __str__(self):
        # Representación legible de la orden
        return f"Orden #{self.id} de {self.user}"

# Modelo para los ítems/productos dentro de una orden
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')  # Orden a la que pertenece el ítem
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Producto comprado
    quantity = models.PositiveIntegerField(default=1)  # Cantidad comprada
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Precio unitario al momento de la compra

    def __str__(self):
        # Representación legible del ítem
        return f"{self.quantity} x {self.product.name}"
