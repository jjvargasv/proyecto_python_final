from rest_framework import serializers
from .models import SuscriptorBoletin

class SuscriptorBoletinSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuscriptorBoletin
        fields = ['id', 'email', 'fecha_suscripcion']
