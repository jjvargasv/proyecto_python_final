from django.urls import path, include
from .views import RegisterView, UserDetailView, CustomTokenObtainPairView, PerfilDetailUpdateView, CambiarPasswordView
from rest_framework_simplejwt.views import TokenRefreshView
from utils.multilingual_endpoints import generate_multilingual_paths

urlpatterns = [
    # Favoritos
    path('favoritos/', include('users.urls_favoritos')),
    path('favorites/', include('users.urls_favoritos')),
    # Productos y Categorías
    path('categorias/', include('products.urls')),
    path('categories/', include('products.urls')),
    path('productos/', include('products.urls')),
    path('products/', include('products.urls')),
    # Carrito
    path('carrito/', include('cart.urls')),
    path('cart/', include('cart.urls')),
    # Órdenes
    path('ordenes/', include('orders.urls')),
    path('orders/', include('orders.urls')),
    # Autenticación
]
# Usuarios
urlpatterns += generate_multilingual_paths('users', RegisterView.as_view(), 'register', pk=False)
urlpatterns += generate_multilingual_paths('users', CustomTokenObtainPairView.as_view(), 'token_obtain_pair', pk=False)
urlpatterns += generate_multilingual_paths('users', UserDetailView.as_view(), 'user-detail', pk=False)
urlpatterns += generate_multilingual_paths('users', PerfilDetailUpdateView.as_view(), 'perfil-detail', pk=False)
urlpatterns += generate_multilingual_paths('users', CambiarPasswordView.as_view(), 'cambiar-password', pk=False)
# Password reset y otros
urlpatterns.append(path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')))
urlpatterns.append(path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'))
urlpatterns += [
    path('token_obtain_pair/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
urlpatterns += [
    path('me/', UserDetailView.as_view(), name='user-detail-me'),
]
