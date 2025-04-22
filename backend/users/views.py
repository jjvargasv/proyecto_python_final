from rest_framework import generics, permissions
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import UserSerializer, RegisterSerializer, PerfilSerializer
from .models import Perfil
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import user_logged_in
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

# Vistas para la gestión de usuarios y perfiles

# Vista para registrar un nuevo usuario
class RegisterView(generics.CreateAPIView):
    """
    Vista para registrar un nuevo usuario.
    
    Permite crear un nuevo usuario en el sistema.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# Vista para obtener los detalles del usuario autenticado
class UserDetailView(generics.RetrieveAPIView):
    """
    Vista para obtener los detalles del usuario autenticado.
    
    Devuelve la información del usuario que ha iniciado sesión.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Obtiene el objeto del usuario autenticado.
        
        Siempre obtiene o crea el perfil si no existe.
        """
        user = self.request.user
        # Siempre obtener o crear el perfil si no existe
        Perfil.objects.get_or_create(user=user, defaults={"nombre_completo": user.get_full_name() or user.username})
        return user

# Vista para obtener o actualizar el perfil del usuario autenticado
class PerfilDetailUpdateView(generics.RetrieveUpdateAPIView):
    """
    Vista para obtener o actualizar el perfil del usuario autenticado.
    
    Permite obtener y actualizar la información del perfil del usuario.
    """
    serializer_class = PerfilSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        """
        Obtiene el objeto del perfil del usuario autenticado.
        
        Obtiene o crea el perfil asociado al usuario.
        """
        user = self.request.user
        # Obtiene o crea el perfil asociado al usuario
        perfil, creado = Perfil.objects.get_or_create(user=user, defaults={"nombre_completo": user.get_full_name() or user.username})
        return perfil

# Serializador personalizado para agregar datos extra al token JWT
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para agregar datos extra al token JWT.
    
    Agrega el nombre de usuario al token JWT.
    """
    @classmethod
    def get_token(cls, user):
        """
        Obtiene el token JWT para el usuario.
        
        Agrega el nombre de usuario al token.
        """
        token = super().get_token(user)
        # Se agrega el nombre de usuario al token
        token['username'] = user.username
        return token

# Vista personalizada para obtener el token JWT
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Vista personalizada para obtener el token JWT.
    
    Permite obtener el token JWT para el usuario.
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """
        Procesa la solicitud para obtener el token JWT.
        
        Envía una señal para registrar el inicio de sesión.
        """
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(username=request.data.get('username'))
            # Señal para registrar el inicio de sesión
            user_logged_in.send(sender=user.__class__, request=request, user=user)
        return response

# Vista para cambiar la contraseña del usuario autenticado
class CambiarPasswordView(APIView):
    """
    Vista para cambiar la contraseña del usuario autenticado.
    
    Permite cambiar la contraseña del usuario que ha iniciado sesión.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Procesa la solicitud para cambiar la contraseña.
        
        Verifica la contraseña actual y la nueva contraseña.
        """
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        if not old_password or not new_password:
            return Response({'detail': 'Debes ingresar la contraseña actual y la nueva.'}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(old_password):
            return Response({'detail': 'La contraseña actual es incorrecta.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_password) < 6:
            return Response({'detail': 'La nueva contraseña debe tener al menos 6 caracteres.'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Contraseña cambiada correctamente.'}, status=status.HTTP_200_OK)
