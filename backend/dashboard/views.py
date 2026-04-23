from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import Order
from .serializers import RecentOrderSerializer


class DashboardSummaryAPIView(APIView):
    def get(self, request):
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

        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'confirmed_orders': confirmed_orders,
            'processing_orders': processing_orders,
            'delivered_orders': delivered_orders,
            'cancelled_orders': cancelled_orders,
            'total_revenue': total_revenue,
            'recent_orders': recent_orders_data,
        })