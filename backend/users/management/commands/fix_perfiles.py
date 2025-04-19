from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from users.models import Perfil

class Command(BaseCommand):
    help = 'Crea perfiles para todos los usuarios que no tengan uno.'

    def handle(self, *args, **kwargs):
        count = 0
        for user in User.objects.all():
            perfil, creado = Perfil.objects.get_or_create(
                user=user,
                defaults={
                    'nombre_completo': user.get_full_name() or user.username,
                    'telefono': '',
                    'direccion': '',
                    'metodo_pago': ''
                }
            )
            if creado:
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Perfil creado para {user.username}'))
        self.stdout.write(self.style.SUCCESS(f'Total de perfiles creados: {count}'))
