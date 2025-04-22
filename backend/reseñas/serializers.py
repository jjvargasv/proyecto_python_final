from rest_framework import serializers
from .models import Reseña

# Serializador para el modelo Reseña
# Convierte instancias de Reseña a JSON y valida los datos de entrada
class ReseñaSerializer(serializers.ModelSerializer):
    class Meta:
        # Modelo asociado a este serializador
        model = Reseña
        # Campos incluidos en la representación de la reseña
        fields = ['id', 'usuario', 'texto', 'calificacion', 'fecha', 'publicado']