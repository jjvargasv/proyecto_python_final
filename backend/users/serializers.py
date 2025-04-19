from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Perfil

class PerfilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['nombre_completo', 'telefono', 'direccion', 'metodo_pago']

class UserSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'perfil', 'is_superuser', 'is_staff']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    nombre_completo = serializers.CharField(write_only=True, required=True)
    telefono = serializers.CharField(write_only=True, required=False, allow_blank=True)
    direccion = serializers.CharField(write_only=True, required=False, allow_blank=True)
    metodo_pago = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'nombre_completo', 'telefono', 'direccion', 'metodo_pago']

    def create(self, validated_data):
        perfil_data = {
            'nombre_completo': validated_data.pop('nombre_completo'),
            'telefono': validated_data.pop('telefono', ''),
            'direccion': validated_data.pop('direccion', ''),
            'metodo_pago': validated_data.pop('metodo_pago', ''),
        }
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        Perfil.objects.create(user=user, **perfil_data)
        return user
