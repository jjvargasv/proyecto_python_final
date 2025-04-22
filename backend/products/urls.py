from django.urls import path
from .views import (
    ProductListCreateView, ProductDetailView,
    CategoryListCreateView, CategoryDetailView,
    ReviewListCreateView
)
from utils.multilingual_endpoints import generate_multilingual_paths

# Definición de rutas para la API de productos, categorías y reseñas
# Estas rutas son utilizadas por el frontend y backend para interactuar con la API
urlpatterns = []

# Rutas de categorías con soporte multilingüe
# Estas rutas permiten la creación y listado de categorías en diferentes idiomas (por ejemplo, /categories/ y /categorias/)
# El soporte multilingüe se logra mediante la función generate_multilingual_paths
urlpatterns += generate_multilingual_paths('categories', CategoryListCreateView.as_view(), 'category-list-create', pk=False)
# Ruta para obtener una categoría específica en diferentes idiomas
# Esta ruta devuelve los detalles de una categoría específica, identificada por su ID
urlpatterns += generate_multilingual_paths('categories', CategoryDetailView.as_view(), 'category-detail', pk=True)

# Rutas de productos con soporte multilingüe
# Estas rutas permiten la creación y listado de productos en diferentes idiomas (por ejemplo, /products/ y /productos/)
# El soporte multilingüe se logra mediante la función generate_multilingual_paths
urlpatterns += generate_multilingual_paths('products', ProductListCreateView.as_view(), 'product-list-create', pk=False)
# Ruta para obtener un producto específico en diferentes idiomas
# Esta ruta devuelve los detalles de un producto específico, identificado por su ID
urlpatterns += generate_multilingual_paths('products', ProductDetailView.as_view(), 'product-detail', pk=True)

# Rutas de reseñas (actualmente solo en inglés, pero se puede ampliar a otros idiomas)
# Esta ruta permite la creación y listado de reseñas para un producto específico
# La ruta se define con un parámetro de producto ID para identificar el producto al que pertenece la reseña
urlpatterns.append(path('products/<int:product_id>/reviews/', ReviewListCreateView.as_view(), name='product-reviews'))
