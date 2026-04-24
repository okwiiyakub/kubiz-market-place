from django.db.models import Sum, Count
from rest_framework.views import APIView
from rest_framework.response import Response

from orders.models import Order
from products.models import Product
from categories.models import Category

from .serializers import RecentOrderSerializer
from rest_framework.permissions import IsAdminUser

from django.db.models.functions import TruncMonth


class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAdminUser]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        orders = Order.objects.all()

        if start_date:
            orders = orders.filter(created_at__date__gte=start_date)

        if end_date:
            orders = orders.filter(created_at__date__lte=end_date)

        total_orders = orders.count()
        pending_orders = orders.filter(status='pending').count()
        confirmed_orders = orders.filter(status='confirmed').count()
        processing_orders = orders.filter(status='processing').count()
        delivered_orders = orders.filter(status='delivered').count()
        cancelled_orders = orders.filter(status='cancelled').count()

        total_revenue = (
            orders.filter(status='delivered')
            .aggregate(total=Sum('total_amount'))['total'] or 0
        )

        recent_orders = orders.order_by('-created_at')[:5]
        recent_orders_data = RecentOrderSerializer(recent_orders, many=True).data

        total_products = Product.objects.count()
        active_products = Product.objects.filter(is_active=True).count()
        inactive_products = Product.objects.filter(is_active=False).count()
        low_stock_products = Product.objects.filter(stock_quantity__lte=5).count()

        products_by_category = (
            Category.objects.annotate(product_count=Count('products'))
            .values('name', 'product_count')
        )

        monthly_sales = (
            orders.filter(status='delivered')
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(total=Sum('total_amount'))
            .order_by('month')
        )

        monthly_sales_data = [
            {
                'month': item['month'].strftime('%b %Y'),
                'total': item['total']
            }
            for item in monthly_sales
        ]

        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'confirmed_orders': confirmed_orders,
            'processing_orders': processing_orders,
            'delivered_orders': delivered_orders,
            'cancelled_orders': cancelled_orders,
            'total_revenue': total_revenue,
            'recent_orders': recent_orders_data,

            'total_products': total_products,
            'active_products': active_products,
            'inactive_products': inactive_products,
            'low_stock_products': low_stock_products,

            'products_by_category': list(products_by_category),
            'monthly_sales': monthly_sales_data,
    })