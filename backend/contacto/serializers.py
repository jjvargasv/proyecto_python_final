from rest_framework import serializers
from .models import MensajeContacto
from django.utils.translation import gettext as _

# Serializador para el modelo MensajeContacto
# Convierte instancias de MensajeContacto a JSON y valida los datos del formulario de contacto
class MensajeContactoSerializer(serializers.ModelSerializer):
    class Meta:
        # Modelo asociado a este serializador
        model = MensajeContacto
        # Campos incluidos en la representación del mensaje de contacto
        fields = ['id', 'nombre', 'email', 'mensaje', 'fecha']

    def validate_email(self, value):
        """
        Valida que el correo electrónico proporcionado sea válido.
        Lanza un error si el email no contiene '@' o está vacío.
        """
        if not value or '@' not in value:
            raise serializers.ValidationError(_('El correo electrónico no es válido.'))
        return value
