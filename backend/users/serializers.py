from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Perfil

# Serializador para el modelo Perfil
# Este serializador se utiliza para convertir instancias de Perfil en datos JSON y viceversa.
class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        # Modelo que se utiliza para este serializador
        model = Perfil
        # Campos que se incluyen en la serialización
        fields = [
            'nombre_completo', 'telefono', 'direccion', 'metodo_pago',
            'foto_perfil', 'fecha_nacimiento', 'genero', 'ciudad', 'pais',
            'biografia', 'facebook', 'instagram', 'twitter', 'linkedin',
            'whatsapp', 'telegram', 'preferencias', 'idioma', 'actualizado'
        ]
        # Configuración adicional para cada campo
        extra_kwargs = {
            'nombre_completo': {'required': False, 'allow_blank': True, 'allow_null': True},
            'telefono': {'required': False, 'allow_blank': True, 'allow_null': True},
            'direccion': {'required': False, 'allow_blank': True, 'allow_null': True},
            'metodo_pago': {'required': False, 'allow_blank': True, 'allow_null': True},
            'foto_perfil': {'required': False, 'allow_null': True},
            'fecha_nacimiento': {'required': False, 'allow_null': True},
            'genero': {'required': False, 'allow_blank': True, 'allow_null': True},
            'ciudad': {'required': False, 'allow_blank': True, 'allow_null': True},
            'pais': {'required': False, 'allow_blank': True, 'allow_null': True},
            'biografia': {'required': False, 'allow_blank': True, 'allow_null': True},
            'facebook': {'required': False, 'allow_blank': True, 'allow_null': True},
            'instagram': {'required': False, 'allow_blank': True, 'allow_null': True},
            'twitter': {'required': False, 'allow_blank': True, 'allow_null': True},
            'linkedin': {'required': False, 'allow_blank': True, 'allow_null': True},
            'whatsapp': {'required': False, 'allow_blank': True, 'allow_null': True},
            'telegram': {'required': False, 'allow_blank': True, 'allow_null': True},
            'preferencias': {'required': False, 'allow_null': True},
            'idioma': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    # Método que se utiliza para convertir los datos de entrada en un formato interno
    def to_internal_value(self, data):
        # Asegura que preferencias se pueda recibir como string JSON o dict
        from rest_framework.exceptions import ValidationError
        import json
        value = super().to_internal_value(data)
        preferencias = data.get('preferencias')
        if preferencias and isinstance(preferencias, str):
            try:
                value['preferencias'] = json.loads(preferencias)
            except Exception:
                raise ValidationError({'preferencias': 'Debe ser un JSON válido.'})
        return value

# Serializador para el modelo User, incluye el perfil y campos relevantes
# Este serializador se utiliza para convertir instancias de User en datos JSON y viceversa.
class UserSerializer(serializers.ModelSerializer):
    # Perfil del usuario (solo lectura)
    perfil = PerfilSerializer(read_only=True)
    # Indica si es superusuario (solo lectura)
    is_superuser = serializers.BooleanField(read_only=True)
    # Indica si es staff (solo lectura)
    is_staff = serializers.BooleanField(read_only=True)
    # Fecha de registro (solo lectura)
    date_joined = serializers.DateTimeField(read_only=True)
    # Último acceso (solo lectura)
    last_login = serializers.DateTimeField(read_only=True)
    class Meta:
        # Modelo que se utiliza para este serializador
        model = User
        # Campos que se incluyen en la serialización
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'perfil', 'is_superuser', 'is_staff',
            'date_joined', 'last_login'
        ]

# Serializador para el registro de usuarios
# Este serializador se utiliza para convertir los datos de registro en una instancia de User.
class RegisterSerializer(serializers.ModelSerializer):
    # Contraseña (solo escritura)
    password = serializers.CharField(write_only=True)
    # Nombre completo (solo escritura)
    nombre_completo = serializers.CharField(write_only=True, required=True)
    # Teléfono (solo escritura)
    telefono = serializers.CharField(write_only=True, required=False, allow_blank=True)
    # Dirección (solo escritura)
    direccion = serializers.CharField(write_only=True, required=False, allow_blank=True)
    # Método de pago (solo escritura)
    metodo_pago = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        # Modelo que se utiliza para este serializador
        model = User
        # Campos que se incluyen en la serialización
        fields = ['id', 'username', 'email', 'password', 'nombre_completo', 'telefono', 'direccion', 'metodo_pago']

    # Método que se utiliza para crear una instancia de User a partir de los datos de registro
    def create(self, validated_data):
        # Datos del perfil
        perfil_data = {
            'nombre_completo': validated_data.pop('nombre_completo'),
            'telefono': validated_data.pop('telefono', ''),
            'direccion': validated_data.pop('direccion', ''),
            'metodo_pago': validated_data.pop('metodo_pago', ''),
        }
        # Crea una instancia de User
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        # Crea una instancia de Perfil asociada al usuario
        Perfil.objects.create(user=user, **perfil_data)
        return user
