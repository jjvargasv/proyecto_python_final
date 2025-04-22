from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer
from products.models import Product
from users.models import Perfil

# Serializador para los ítems de una orden
class OrderItemSerializer(serializers.ModelSerializer):
    # Información completa del producto comprado (solo lectura)
    product = ProductSerializer(read_only=True)
    # Solo para escritura, relacionado con el producto
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        # Modelo asociado
        model = OrderItem
        # Campos incluidos en el serializador
        fields = ['id', 'product', 'product_id', 'quantity', 'price']

# Serializador principal para órdenes
class OrderSerializer(serializers.ModelSerializer):
    # Lista de ítems de la orden (solo lectura)
    items = OrderItemSerializer(many=True, read_only=True)
    # Datos para crear ítems (solo escritura)
    items_data = serializers.ListField(write_only=True, child=serializers.DictField(), required=False)
    # Usuario como string (solo lectura)
    user = serializers.StringRelatedField(read_only=True)
    # Nombre completo del perfil
    nombre_completo = serializers.SerializerMethodField()
    # Teléfono del perfil
    telefono = serializers.SerializerMethodField()
    # Dirección del perfil
    direccion = serializers.SerializerMethodField()
    # Método de pago del perfil
    metodo_pago = serializers.SerializerMethodField()

    class Meta:
        # Modelo asociado
        model = Order
        # Campos incluidos en el serializador
        fields = ['id', 'user', 'nombre_completo', 'telefono', 'direccion', 'metodo_pago', 'created_at', 'updated_at', 'status', 'total', 'items', 'items_data']

    # Métodos para obtener información adicional del perfil del usuario
    def get_nombre_completo(self, obj):
        # Obtiene el nombre completo del perfil del usuario, si existe
        return getattr(obj.user.perfil, 'nombre_completo', '') if hasattr(obj.user, 'perfil') else ''
    def get_telefono(self, obj):
        # Obtiene el teléfono del perfil del usuario, si existe
        return getattr(obj.user.perfil, 'telefono', '') if hasattr(obj.user, 'perfil') else ''
    def get_direccion(self, obj):
        # Obtiene la dirección del perfil del usuario, si existe
        return getattr(obj.user.perfil, 'direccion', '') if hasattr(obj.user, 'perfil') else ''
    def get_metodo_pago(self, obj):
        # Obtiene el método de pago del perfil del usuario, si existe
        return getattr(obj.user.perfil, 'metodo_pago', '') if hasattr(obj.user, 'perfil') else ''

    # Crea una orden y sus ítems asociados
    def create(self, validated_data):
        # Obtiene los datos de los ítems de la orden
        items_data = validated_data.pop('items_data', [])
        # Crea la orden con los datos validados
        order = Order.objects.create(**validated_data)
        # Inicializa el total de la orden
        total = 0
        # Itera sobre los ítems de la orden
        for item in items_data:
            # Obtiene el ID del producto y la cantidad
            product_id = item.get('producto')
            cantidad = item.get('cantidad', 1)
            # Obtiene el producto
            product = Product.objects.get(id=product_id)
            # Obtiene el precio del producto
            price = product.price
            # Crea el ítem de la orden
            OrderItem.objects.create(order=order, product=product, quantity=cantidad, price=price)
            # Actualiza el total de la orden
            total += price * cantidad
        # Actualiza el total de la orden
        order.total = total
        # Guarda la orden
        order.save()
        # Retorna la orden creada
        return order
