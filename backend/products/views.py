from django.shortcuts import render
from rest_framework import generics, permissions, response
from .models import Product, Category, Review
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer

# Vistas para la gestión de productos, categorías y reseñas

# Permiso personalizado: permite solo lectura a todos y escritura solo a administradores
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado que permite solo lectura a todos y escritura solo a administradores.
    """
    def has_permission(self, request, view):
        # Permitir solo lectura para todos, escritura solo para admin
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

# Vista para listar y crear productos
class ProductListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar y crear productos.
    - Permite a cualquier usuario ver productos.
    - Solo los administradores pueden crear nuevos productos.
    - Soporta filtrado por productos destacados y por categoría.
    """
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        """
        Obtiene el conjunto de productos ordenados por fecha de creación en orden descendente.
        - Filtra productos destacados si se solicita.
        - Filtra productos por categoría si se solicita.
        """
        queryset = Product.objects.all().order_by('-created_at')
        featured = self.request.query_params.get('featured')
        category = self.request.query_params.get('category')
        # Filtra productos destacados si se solicita
        if featured is not None:
            if featured.lower() in ['true', '1', 'yes']:
                queryset = queryset.filter(featured=True)
            elif featured.lower() in ['false', '0', 'no']:
                queryset = queryset.filter(featured=False)
        # Filtra productos por categoría si se solicita
        if category is not None:
            queryset = queryset.filter(category_id=category)
        return queryset

# Vista para obtener, actualizar o eliminar un producto específico
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un producto específico.
    - Permite a cualquier usuario ver detalles de un producto.
    - Solo los administradores pueden actualizar o eliminar productos.
    - Incrementa el contador de vistas cada vez que se consulta el producto.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def retrieve(self, request, *args, **kwargs):
        """
        Obtiene un producto específico y incrementa su contador de vistas.
        """
        instance = self.get_object()
        # Incrementa el contador de vistas del producto
        instance.views_count = (instance.views_count or 0) + 1
        instance.save(update_fields=["views_count"])
        serializer = self.get_serializer(instance)
        return response.Response(serializer.data)

# Vista para listar y crear categorías
class CategoryListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar y crear categorías.
    - Permite a cualquier usuario ver categorías.
    - Solo los administradores pueden crear nuevas categorías.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

# Vista para obtener, actualizar o eliminar una categoría específica
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar una categoría específica.
    - Permite a cualquier usuario ver detalles de una categoría.
    - Solo los administradores pueden actualizar o eliminar categorías.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

# Vista para listar y crear reseñas de un producto
class ReviewListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar y crear reseñas de un producto.
    - Permite a cualquier usuario ver reseñas de un producto.
    - Solo usuarios autenticados pueden crear nuevas reseñas.
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """
        Obtiene el conjunto de reseñas de un producto específico ordenadas por fecha de creación en orden descendente.
        """
        product_id = self.kwargs['product_id']
        # Solo mostrar reseñas del producto solicitado
        return Review.objects.filter(product_id=product_id).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Crea una nueva reseña y asigna el usuario autenticado y producto.
        """
        product_id = self.kwargs['product_id']
        serializer.save(user=self.request.user, product_id=product_id)
