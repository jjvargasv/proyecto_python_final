from rest_framework import generics, permissions
from .models import SuscriptorBoletin
from .serializers import SuscriptorBoletinSerializer
from django.utils.translation import gettext as _

# Vista para crear un nuevo suscriptor del boletín
# Permite que cualquier usuario se suscriba al boletín informativo
class SuscriptorBoletinCreateView(generics.CreateAPIView):
    queryset = SuscriptorBoletin.objects.all()
    serializer_class = SuscriptorBoletinSerializer
    permission_classes = [permissions.AllowAny]  # Permite el acceso a cualquier usuario
