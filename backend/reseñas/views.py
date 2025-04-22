# Vistas para la gestión de reseñas de productos
from rest_framework import generics, permissions
from .models import Reseña
from .serializers import ReseñaSerializer
from django.utils.translation import gettext as _

# Vista para listar y crear reseñas de un producto
# Permite que usuarios autenticados creen reseñas solo si han comprado el producto
class ReseñaListCreateView(generics.ListCreateAPIView):
    serializer_class = ReseñaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Devuelve las reseñas asociadas a un producto específico, identificado por product_id en la URL.
        """
        product_id = self.kwargs['product_id']
        return Reseña.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        """
        Permite crear una reseña solo si el usuario ha comprado el producto.
        Asocia la reseña al usuario autenticado y al producto indicado en la URL.
        """
        product_id = self.kwargs['product_id']
        user = self.request.user
        from orders.models import OrderItem
        ha_comprado = OrderItem.objects.filter(order__user=user, product_id=product_id).exists()
        if not ha_comprado:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(_('Solo puedes reseñar productos que hayas comprado.'))
        serializer.save(usuario=user, product_id=product_id)