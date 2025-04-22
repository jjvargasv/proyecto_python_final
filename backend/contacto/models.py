from django.db import models

# Modelo para almacenar los mensajes enviados desde el formulario de contacto
class MensajeContacto(models.Model):
    nombre = models.CharField(max_length=100)  # Nombre de la persona que envía el mensaje
    email = models.EmailField()  # Correo electrónico del remitente
    mensaje = models.TextField()  # Contenido del mensaje
    fecha = models.DateTimeField(auto_now_add=True)  # Fecha y hora de envío

    def __str__(self):
        # Representación legible del mensaje en el admin
        return f"{self.nombre} <{self.email}>"
