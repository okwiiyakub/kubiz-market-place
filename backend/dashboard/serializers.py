from rest_framework import serializers
from orders.models import Order


class RecentOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id',
            'full_name',
            'phone_number',
            'city',
            'total_amount',
            'status',
            'created_at',
        ]