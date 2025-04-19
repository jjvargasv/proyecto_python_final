from django.urls import path
from .views import SuscriptorBoletinCreateView

urlpatterns = [
    path('suscribirse/', SuscriptorBoletinCreateView.as_view(), name='boletin-suscribirse'),
]
