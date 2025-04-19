from rest_framework import generics, permissions, filters
from .models import MensajeContacto
from .serializers import MensajeContactoSerializer

class MensajeContactoCreateView(generics.CreateAPIView):
    queryset = MensajeContacto.objects.all()
    serializer_class = MensajeContactoSerializer
    permission_classes = [permissions.AllowAny]

class MensajeContactoListView(generics.ListAPIView):
    queryset = MensajeContacto.objects.all().order_by('-fecha')
    serializer_class = MensajeContactoSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'email', 'mensaje']
    page_size = 10
