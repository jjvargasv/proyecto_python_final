from django.db import models

# Modelo para almacenar suscriptores del boletín informativo
class SuscriptorBoletin(models.Model):
    email = models.EmailField(unique=True)  # Correo electrónico único del suscriptor
    fecha_suscripcion = models.DateTimeField(auto_now_add=True)  # Fecha y hora de suscripción

    def __str__(self):
        # Representación legible del suscriptor en el admin
        return self.email
