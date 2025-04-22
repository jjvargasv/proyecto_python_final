from django.urls import path
from .views import CartView, CartItemAddView, CartItemUpdateDeleteView, CartClearView
from utils.multilingual_endpoints import generate_multilingual_paths

urlpatterns = [
    path('', CartView.as_view(), name='cart-list'),
]
urlpatterns += [
    path('items/', CartItemAddView.as_view(), name='cartitem-add'),
]
urlpatterns += [
    path('items/<int:pk>/', CartItemUpdateDeleteView.as_view(), name='cartitem-update-delete'),
]
urlpatterns += generate_multilingual_paths('cart', CartView.as_view(), 'cart', pk=False)
urlpatterns += generate_multilingual_paths('cart', CartItemAddView.as_view(), 'cartitem-add', pk=False)
urlpatterns += generate_multilingual_paths('cart', CartItemUpdateDeleteView.as_view(), 'cartitem-update-delete', pk=True)
urlpatterns += generate_multilingual_paths('cart', CartClearView.as_view(), 'cart-clear', pk=False)
