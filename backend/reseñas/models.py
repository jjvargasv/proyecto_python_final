from django.db import models
from django.conf import settings

class Reseña(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    texto = models.TextField()
    calificacion = models.PositiveSmallIntegerField(default=5)
    fecha = models.DateTimeField(auto_now_add=True)
    publicado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.usuario.username}: {self.texto[:30]}..."
