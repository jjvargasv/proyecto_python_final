from django.urls import path
from .views_favoritos import FavoritoListCreateView, FavoritoDestroyView
from utils.multilingual_endpoints import generate_multilingual_paths

urlpatterns = []
urlpatterns += [
    path('', FavoritoListCreateView.as_view(), name='favorito-list-create'),
]
urlpatterns += [
    path('<int:pk>/', FavoritoDestroyView.as_view(), name='favorito-destroy'),
]
urlpatterns += [
    path('favorites/', FavoritoListCreateView.as_view(), name='favorito-list-create-en'),
    path('favorites/<int:pk>/', FavoritoDestroyView.as_view(), name='favorito-destroy-en'),
]
urlpatterns += generate_multilingual_paths('favorites', FavoritoListCreateView.as_view(), 'favorito-list-create', pk=False)
urlpatterns += generate_multilingual_paths('favorites', FavoritoDestroyView.as_view(), 'favorito-destroy', pk=True)
