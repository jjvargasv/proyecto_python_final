from django.urls import path
from .views import MensajeContactoCreateView, MensajeContactoListView

urlpatterns = [
    path('enviar/', MensajeContactoCreateView.as_view(), name='contacto-enviar'),
    path('mensajes/', MensajeContactoListView.as_view(), name='contacto-list'),
]
