from django.urls import path
from .views import (
    ProductListAPIView,
    ProductDetailAPIView,
    AdminProductListCreateAPIView,
    AdminProductRetrieveUpdateDestroyAPIView,
)

urlpatterns = [
    # Admin APIs
    path('admin/manage/', AdminProductListCreateAPIView.as_view(), name='admin-product-list-create'),
    path('admin/manage/<int:pk>/', AdminProductRetrieveUpdateDestroyAPIView.as_view(), name='admin-product-detail'),

    # Public APIs
    path('', ProductListAPIView.as_view(), name='product-list'),
    path('<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
]