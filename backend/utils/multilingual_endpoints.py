# Herramienta para generar rutas multilingües automáticamente
# Puedes importar y usar generate_multilingual_paths en tus archivos de urls.py

from django.urls import path
from typing import List, Callable

# Diccionario de traducciones de recursos principales
RESOURCE_TRANSLATIONS = {
    'favorites': {
        'es': 'favoritos', 'en': 'favorites', 'fr': 'favoris', 'de': 'lieblingsprodukte', 'pt': 'favoritos', 'it': 'preferiti', 'ca': 'preferits'
    },
    'products': {
        'es': 'productos', 'en': 'products', 'fr': 'produits', 'de': 'produkte', 'pt': 'produtos', 'it': 'prodotti', 'ca': 'productes'
    },
    'categories': {
        'es': 'categorias', 'en': 'categories', 'fr': 'categories', 'de': 'kategorien', 'pt': 'categorias', 'it': 'categorie', 'ca': 'categories'
    },
    'cart': {
        'es': 'carrito', 'en': 'cart', 'fr': 'panier', 'de': 'warenkorb', 'pt': 'carrinho', 'it': 'carrello', 'ca': 'carret'
    },
    'orders': {
        'es': 'ordenes', 'en': 'orders', 'fr': 'commandes', 'de': 'bestellungen', 'pt': 'pedidos', 'it': 'ordini', 'ca': 'comandes'
    },
    'users': {
        'es': 'usuarios', 'en': 'users', 'fr': 'utilisateurs', 'de': 'benutzer', 'pt': 'usuarios', 'it': 'utenti', 'ca': 'usuaris'
    },
}

def generate_multilingual_paths(resource: str, view: Callable, name: str, pk: bool = False) -> List:
    """
    Genera rutas path() para todos los idiomas soportados para un recurso.
    Si pk=True, agrega <int:pk>/ al final.
    """
    paths = []
    translations = RESOURCE_TRANSLATIONS.get(resource, {})
    for lang, translation in translations.items():
        url = f"{translation}/"
        if pk:
            url += "<int:pk>/"
        paths.append(path(url, view, name=f"{name}-{lang}"))
    return paths
