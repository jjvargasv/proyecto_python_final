from django.db import models
from django.conf import settings

# Modelo para almacenar reseñas de usuarios sobre productos
class Reseña(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Usuario que realiza la reseña
    texto = models.TextField()  # Texto de la reseña
    calificacion = models.PositiveSmallIntegerField(default=5)  # Calificación otorgada (por ejemplo, de 1 a 5)
    fecha = models.DateTimeField(auto_now_add=True)  # Fecha de publicación
    publicado = models.BooleanField(default=True)  # Indica si la reseña está visible públicamente

    def __str__(self):
        # Representación legible de la reseña en el admin
        return f"{self.usuario.username}: {self.texto[:30]}..."
