from rest_framework import generics, permissions
from .models import SuscriptorBoletin
from .serializers import SuscriptorBoletinSerializer

class SuscriptorBoletinCreateView(generics.CreateAPIView):
    queryset = SuscriptorBoletin.objects.all()
    serializer_class = SuscriptorBoletinSerializer
    permission_classes = [permissions.AllowAny]
