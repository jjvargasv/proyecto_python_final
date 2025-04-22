from django.urls import path
from .views import SuscriptorBoletinCreateView
from utils.multilingual_endpoints import generate_multilingual_paths

urlpatterns = []
urlpatterns += generate_multilingual_paths('boletin', SuscriptorBoletinCreateView.as_view(), 'boletin-suscribirse', pk=False)
