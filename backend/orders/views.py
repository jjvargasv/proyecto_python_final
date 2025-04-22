from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer

# Vistas para la gestión y consulta de órdenes y sus ítems

# Vista para listar y crear órdenes del usuario autenticado
class OrderListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar y crear órdenes del usuario autenticado.
    
    Proporciona una lista de órdenes existentes y permite crear nuevas órdenes.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Solo muestra las órdenes del usuario autenticado, ordenadas por fecha descendente.
        
        Esto garantiza que solo se muestren las órdenes que pertenecen al usuario autenticado.
        """
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Asigna el usuario autenticado a la nueva orden.
        
        Esto garantiza que la nueva orden se asigne al usuario que la creó.
        """
        serializer.save(user=self.request.user)

# Vista para obtener, actualizar o eliminar una orden específica
class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una orden específica.
    
    Proporciona acceso a una orden específica y permite actualizar o eliminarla.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Solo permite acceder a órdenes propias del usuario autenticado.
        
        Esto garantiza que solo se puedan acceder a órdenes que pertenecen al usuario autenticado.
        """
        return Order.objects.filter(user=self.request.user)

# Vista para listar los ítems de una orden específica
class OrderItemListView(generics.ListAPIView):
    """
    Vista para listar los ítems de una orden específica.
    
    Proporciona una lista de ítems que pertenecen a una orden específica.
    """
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Solo permite ver ítems de órdenes propias.
        
        Esto garantiza que solo se puedan ver ítems que pertenecen a órdenes del usuario autenticado.
        """
        return OrderItem.objects.filter(order__user=self.request.user, order_id=self.kwargs['order_id'])
