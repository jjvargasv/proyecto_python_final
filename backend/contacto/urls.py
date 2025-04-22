from django.urls import path
from .views import MensajeContactoCreateView, MensajeContactoListView
from utils.multilingual_endpoints import generate_multilingual_paths

# Rutas para el envío y la administración de mensajes de contacto
urlpatterns = []
# Ruta para que cualquier usuario pueda enviar un mensaje de contacto (soporte multilingüe)
urlpatterns += generate_multilingual_paths('contact', MensajeContactoCreateView.as_view(), 'contacto-enviar', pk=False)
# Ruta para que los administradores puedan listar y buscar mensajes recibidos (soporte multilingüe)
urlpatterns += generate_multilingual_paths('contact', MensajeContactoListView.as_view(), 'contacto-list', pk=False)
