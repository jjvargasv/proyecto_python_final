from django.urls import path
from .views import (
    OrderListCreateView, OrderDetailView, OrderItemListView
)
from utils.multilingual_endpoints import generate_multilingual_paths

urlpatterns = []
urlpatterns += generate_multilingual_paths('orders', OrderListCreateView.as_view(), 'order-list-create', pk=False)
urlpatterns += generate_multilingual_paths('orders', OrderDetailView.as_view(), 'order-detail', pk=True)
urlpatterns += generate_multilingual_paths('orders', OrderItemListView.as_view(), 'orderitem-list', pk=True)
