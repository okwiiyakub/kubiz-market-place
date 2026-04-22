from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer


class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'