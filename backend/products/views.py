from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer


class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    lookup_field = 'slug'