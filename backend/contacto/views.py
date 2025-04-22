from rest_framework import generics, permissions, filters
from .models import MensajeContacto
from .serializers import MensajeContactoSerializer
from django.utils.translation import gettext as _

# Vista para crear un nuevo mensaje de contacto
# Permite a cualquier usuario enviar un mensaje desde el formulario de contacto
class MensajeContactoCreateView(generics.CreateAPIView):
    """
    Vista para crear un nuevo mensaje de contacto.

    Permite a cualquier usuario enviar un mensaje desde el formulario de contacto.
    """
    queryset = MensajeContacto.objects.all()
    serializer_class = MensajeContactoSerializer
    permission_classes = [permissions.AllowAny]  # Permiso para que cualquier usuario pueda enviar un mensaje

# Vista para listar todos los mensajes de contacto
# Solo accesible para administradores. Permite buscar por nombre, email o mensaje.
class MensajeContactoListView(generics.ListAPIView):
    """
    Vista para listar todos los mensajes de contacto.

    Solo accesible para administradores. Permite buscar por nombre, email o mensaje.
    """
    queryset = MensajeContacto.objects.all().order_by('-fecha')
    serializer_class = MensajeContactoSerializer
    permission_classes = [permissions.IsAdminUser]  # Permiso solo para administradores
    filter_backends = [filters.SearchFilter]  # Filtro para buscar mensajes
    search_fields = ['nombre', 'email', 'mensaje']  # Campos para buscar mensajes
    page_size = 10  # Tamaño de la página para la paginación
