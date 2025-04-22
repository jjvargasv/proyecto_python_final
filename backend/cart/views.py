from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product
from django.shortcuts import get_object_or_404

# Vistas para la gestión del carrito de compras y sus ítems

# Vista principal del carrito: permite obtener el carrito del usuario autenticado
class CartView(APIView):
    """
    Vista principal del carrito de compras.
    
    Permite obtener el carrito del usuario autenticado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """
        Obtiene el carrito del usuario autenticado.
        
        Si el carrito no existe, lo crea.
        """
        # Obtiene o crea el carrito del usuario
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

# Vista para agregar productos al carrito
class CartItemAddView(APIView):
    """
    Vista para agregar productos al carrito de compras.
    
    Permite agregar un producto al carrito del usuario autenticado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Agrega un producto al carrito del usuario autenticado.
        
        Si el producto ya está en el carrito, suma la cantidad.
        """
        # Obtiene o crea el carrito del usuario
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        product = get_object_or_404(Product, id=product_id)
        # Si el producto ya está en el carrito, suma la cantidad
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            item.quantity += quantity
        else:
            item.quantity = quantity
        item.save()
        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)

# Vista para actualizar la cantidad o eliminar un ítem del carrito
class CartItemUpdateDeleteView(APIView):
    """
    Vista para actualizar la cantidad o eliminar un ítem del carrito de compras.
    
    Permite actualizar la cantidad de un producto en el carrito o eliminar un producto del carrito.
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        """
        Actualiza la cantidad de un producto en el carrito.
        
        Requiere el ID del ítem del carrito y la nueva cantidad.
        """
        # Actualiza la cantidad de un producto en el carrito
        cart = get_object_or_404(Cart, user=request.user)
        item = get_object_or_404(CartItem, cart=cart, pk=pk)
        quantity = request.data.get('quantity')
        if quantity is not None:
            item.quantity = int(quantity)
            item.save()
        return Response(CartItemSerializer(item).data)

    def delete(self, request, pk):
        """
        Elimina un producto del carrito.
        
        Requiere el ID del ítem del carrito.
        """
        # Elimina un producto del carrito
        cart = get_object_or_404(Cart, user=request.user)
        item = get_object_or_404(CartItem, cart=cart, pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Vista para vaciar el carrito de compras
class CartClearView(APIView):
    """
    Vista para vaciar el carrito de compras.
    
    Permite eliminar todos los ítems del carrito del usuario autenticado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """
        Elimina todos los ítems del carrito del usuario autenticado.
        """
        # Elimina todos los ítems del carrito del usuario
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        return Response({'detail': 'Carrito vaciado.'}, status=status.HTTP_200_OK)
