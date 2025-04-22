from rest_framework import serializers
from .models_favoritos import Favorito
from products.serializers import ProductSerializer

class FavoritoSerializer(serializers.ModelSerializer):
    producto = ProductSerializer(read_only=True)
    producto_id = serializers.PrimaryKeyRelatedField(queryset=Favorito._meta.get_field('producto').related_model.objects.all(), source='producto', write_only=True)

    class Meta:
        model = Favorito
        fields = ['id', 'user', 'producto', 'producto_id', 'creado']
        read_only_fields = ['id', 'user', 'producto', 'creado']
