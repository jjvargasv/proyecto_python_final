from django.urls import path
from .views import (
    OrderListCreateView, OrderDetailView, OrderItemListView
)

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/<int:order_id>/items/', OrderItemListView.as_view(), name='orderitem-list'),
]
