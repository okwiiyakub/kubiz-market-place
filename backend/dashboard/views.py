from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response

from orders.models import Order
from products.models import Product
from categories.models import Category

from .serializers import RecentOrderSerializer


class DashboardSummaryAPIView(APIView):
    def get(self, request):

        # ---------------------------
        # ORDER ANALYTICS
        # ---------------------------

        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        confirmed_orders = Order.objects.filter(status='confirmed').count()
        processing_orders = Order.objects.filter(status='processing').count()
        delivered_orders = Order.objects.filter(status='delivered').count()
        cancelled_orders = Order.objects.filter(status='cancelled').count()

        total_revenue = (
            Order.objects.filter(status='delivered')
            .aggregate(total=Sum('total_amount'))['total'] or 0
        )

        recent_orders = Order.objects.order_by('-created_at')[:5]
        recent_orders_data = RecentOrderSerializer(recent_orders, many=True).data


        # ---------------------------
        # PRODUCT ANALYTICS
        # ---------------------------

        total_products = Product.objects.count()

        active_products = Product.objects.filter(is_active=True).count()

        inactive_products = Product.objects.filter(is_active=False).count()

        low_stock_products = Product.objects.filter(stock_quantity__lte=5).count()


        # ---------------------------
        # CATEGORY DISTRIBUTION
        # ---------------------------

        products_by_category = (
            Category.objects.annotate(product_count=Count('products'))
            .values('name', 'product_count')
        )


        return Response({
            # ORDER DATA
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'confirmed_orders': confirmed_orders,
            'processing_orders': processing_orders,
            'delivered_orders': delivered_orders,
            'cancelled_orders': cancelled_orders,
            'total_revenue': total_revenue,
            'recent_orders': recent_orders_data,

            # PRODUCT DATA
            'total_products': total_products,
            'active_products': active_products,
            'inactive_products': inactive_products,
            'low_stock_products': low_stock_products,

            # CATEGORY DATA
            'products_by_category': list(products_by_category),
        })