from django.core.management.base import BaseCommand
from products.models import Category, Product
from django.core.files.base import ContentFile
import requests

class Command(BaseCommand):
    help = 'Carga categorías y productos de ejemplo anime'

    def handle(self, *args, **kwargs):
        # Crear categoría si no existe
        cat, _ = Category.objects.get_or_create(name='Anime')
        # Lista de productos de ejemplo
        productos = [
            {
                'name': 'Figura Goku',
                'description': 'Figura coleccionable de Goku Super Saiyan.',
                'price': 29.99,
                'stock': 10,
                'image_url': 'https://i.imgur.com/8RKXAIV.png',
            },
            {
                'name': 'Camiseta Naruto',
                'description': 'Camiseta estampada de Naruto Uzumaki.',
                'price': 19.99,
                'stock': 20,
                'image_url': 'https://i.imgur.com/2nCt3Sbl.jpg',
            },
            {
                'name': 'Taza One Piece',
                'description': 'Taza con diseño de Luffy.',
                'price': 12.99,
                'stock': 15,
                'image_url': 'https://i.imgur.com/3GvwNBf.jpg',
            },
        ]
        for prod in productos:
            if not Product.objects.filter(name=prod['name']).exists():
                p = Product(
                    name=prod['name'],
                    description=prod['description'],
                    price=prod['price'],
                    stock=prod['stock'],
                    category=cat
                )
                # Descargar imagen de ejemplo
                try:
                    img_resp = requests.get(prod['image_url'])
                    if img_resp.status_code == 200:
                        p.image.save(prod['name'] + '.jpg', ContentFile(img_resp.content), save=False)
                except Exception:
                    pass
                p.save()
        self.stdout.write(self.style.SUCCESS('¡Datos de ejemplo cargados!'))
