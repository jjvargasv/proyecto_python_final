# Archivo habilitado: rutas de reseñas restauradas

from django.urls import path
from .views import ReseñaListCreateView
from utils.multilingual_endpoints import generate_multilingual_paths

urlpatterns = []
urlpatterns += generate_multilingual_paths('reseñas', ReseñaListCreateView.as_view(), 'reseña-list-create', pk=False)
