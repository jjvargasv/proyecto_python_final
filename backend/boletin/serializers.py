from rest_framework import serializers
from .models import SuscriptorBoletin

# Serializador para el modelo SuscriptorBoletin
# Convierte instancias de SuscriptorBoletin a JSON y valida los datos de entrada
class SuscriptorBoletinSerializer(serializers.ModelSerializer):
    class Meta:
        # Modelo asociado a este serializador
        model = SuscriptorBoletin
        # Campos incluidos en la representación del suscriptor
        fields = ['id', 'email', 'fecha_suscripcion']
