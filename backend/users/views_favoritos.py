from rest_framework import generics, permissions
from .models_favoritos import Favorito
from .serializers_favoritos import FavoritoSerializer

class FavoritoListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoritoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorito.objects.filter(user=self.request.user).order_by('-creado')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoritoDestroyView(generics.DestroyAPIView):
    serializer_class = FavoritoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorito.objects.filter(user=self.request.user)
