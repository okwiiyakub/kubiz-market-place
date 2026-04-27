from django.urls import path
from .views import (
    OrderCreateAPIView,
    AdminOrderListAPIView,
    AdminOrderDetailUpdateAPIView,
)

from .views import (
    OrderCreateAPIView,
    AdminOrderListAPIView,
    AdminOrderDetailUpdateAPIView,
    CustomerOrderListAPIView,
)

urlpatterns = [
    path('', OrderCreateAPIView.as_view(), name='order-create'),

    path('admin/manage/', AdminOrderListAPIView.as_view(), name='admin-order-list'),
    path('admin/manage/<int:pk>/', AdminOrderDetailUpdateAPIView.as_view(), name='admin-order-detail-update'),
    path('my-orders/', CustomerOrderListAPIView.as_view(), name='customer-orders'),
]