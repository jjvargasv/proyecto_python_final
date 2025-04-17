from django.urls import path
from .views import CartView, CartItemAddView, CartItemUpdateDeleteView

urlpatterns = [
    path('', CartView.as_view(), name='cart-detail'),
    path('items/', CartItemAddView.as_view(), name='cartitem-add'),
    path('items/<int:pk>/', CartItemUpdateDeleteView.as_view(), name='cartitem-update-delete'),
]
