from rest_framework import serializers
from .models import Product, Category, Review, ProductImage
from django.urls import reverse
from urllib.parse import urljoin
from django.conf import settings
from django.http import HttpRequest

# Serializador para categorías de productos
# Representa las categorías de productos en la API
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        # Modelo asociado a este serializador
        model = Category
        # Campos incluidos en la representación de la categoría
        fields = ['id', 'name', 'description']

# Serializador para reseñas de productos
# Representa las reseñas de productos en la API
class ReviewSerializer(serializers.ModelSerializer):
    # Muestra el usuario que realizó la reseña como un string (solo lectura)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        # Modelo asociado a este serializador
        model = Review
        # Campos incluidos en la representación de la reseña
        fields = ['id', 'user', 'rating', 'comment', 'created_at', 'updated_at']
        # Campos solo lectura
        read_only_fields = ['user', 'created_at', 'updated_at']

# Serializador para imágenes adicionales de productos
# Representa las imágenes adicionales de productos en la API
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        # Modelo asociado a este serializador
        model = ProductImage
        # Campos incluidos en la representación de la imagen
        fields = ['id', 'image', 'alt']

# Serializador principal para productos
# Representa los productos en la API, incluyendo imágenes, categoría y reseñas
class ProductSerializer(serializers.ModelSerializer):
    # Imágenes adicionales del producto (solo lectura)
    images = ProductImageSerializer(many=True, read_only=True)
    # Datos completos de la categoría (solo lectura)
    category = CategorySerializer(read_only=True)
    # Solo para escritura, permite establecer la categoría del producto
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True)
    # Reseñas del producto (solo lectura)
    reviews = ReviewSerializer(many=True, read_only=True)
    # URL absoluta de la imagen principal del producto
    image_url = serializers.SerializerMethodField()
    # Número de vistas del producto (solo lectura)
    views_count = serializers.IntegerField(read_only=True)

    class Meta:
        # Modelo asociado a este serializador
        model = Product
        # Campos incluidos en la representación del producto
        fields = ['id', 'name', 'description', 'detalles', 'price', 'stock', 'image', 'image_url', 'images', 'category', 'category_id', 'created_at', 'updated_at', 'reviews', 'featured', 'views_count']

    def get_image_url(self, obj):
        """
        Obtiene la URL absoluta de la imagen principal del producto.
        Si la solicitud está disponible, utiliza el esquema y host correctos.
        """
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            else:
                return urljoin(settings.MEDIA_URL, obj.image.url)
        return None
