from django.db import models
from django.contrib.auth.models import User

# Modelo extendido de perfil de usuario para almacenar información adicional
class Perfil(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')  # Relación uno a uno con el usuario
    nombre_completo = models.CharField(max_length=150)  # Nombre completo del usuario
    telefono = models.CharField(max_length=30, blank=True)  # Teléfono de contacto
    direccion = models.CharField(max_length=255, blank=True)  # Dirección de envío o residencia
    metodo_pago = models.CharField(max_length=50, blank=True)  # Método de pago preferido
    # Nuevos campos
    foto_perfil = models.ImageField(upload_to='avatars/', blank=True, null=True)  # Foto de perfil del usuario
    fecha_nacimiento = models.DateField(blank=True, null=True)  # Fecha de nacimiento
    genero = models.CharField(max_length=20, blank=True)  # Género del usuario
    ciudad = models.CharField(max_length=100, blank=True)  # Ciudad de residencia
    pais = models.CharField(max_length=100, blank=True)  # País de residencia
    biografia = models.TextField(blank=True)  # Descripción o biografía personal
    facebook = models.URLField(blank=True)  # Enlace a Facebook
    instagram = models.URLField(blank=True)  # Enlace a Instagram
    twitter = models.URLField(blank=True)  # Enlace a Twitter
    linkedin = models.URLField(blank=True)  # Enlace a LinkedIn
    whatsapp = models.CharField(max_length=30, blank=True)  # Número de WhatsApp
    telegram = models.CharField(max_length=30, blank=True)  # Usuario o número de Telegram
    preferencias = models.JSONField(blank=True, null=True)  # Preferencias del usuario en formato JSON
    idioma = models.CharField(max_length=20, blank=True)  # Idioma preferido
    actualizado = models.DateTimeField(auto_now=True)  # Fecha de última actualización del perfil

    def __str__(self):
        # Representación legible del perfil
        return self.nombre_completo or self.user.username
