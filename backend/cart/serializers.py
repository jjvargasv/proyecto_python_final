from rest_framework import serializers
from .models import Cart, CartItem
from products.serializers import ProductSerializer

# Serializador para los ítems del carrito
class CartItemSerializer(serializers.ModelSerializer):
    # Información completa del producto, solo lectura
    product = ProductSerializer(read_only=True)
    # Solo para escritura, se utiliza para establecer el producto relacionado
    product_id = serializers.PrimaryKeyRelatedField(queryset=CartItem.objects.all(), source='product', write_only=True)

    class Meta:
        # Modelo que se utiliza para este serializador
        model = CartItem
        # Campos que se incluyen en el serializador
        fields = ['id', 'product', 'product_id', 'quantity', 'added_at']

# Serializador principal del carrito
class CartSerializer(serializers.ModelSerializer):
    # Lista de ítems del carrito, solo lectura
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        # Modelo que se utiliza para este serializador
        model = Cart
        # Campos que se incluyen en el serializador
        fields = ['id', 'user', 'created_at', 'updated_at', 'items']
        # Campo que solo se puede leer, no se puede modificar
        read_only_fields = ['user']
