from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemCreateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    phone_number = serializers.CharField(max_length=20)
    email = serializers.EmailField(required=False, allow_blank=True)
    address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    notes = serializers.CharField(required=False, allow_blank=True)
    items = OrderItemCreateSerializer(many=True)

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        customer = self.context.get('customer')
        order = Order.objects.create(customer=customer, **validated_data)

        total_amount = 0

        for item_data in items_data:
            product = Product.objects.get(id=item_data['id'])
            quantity = item_data['quantity']
            subtotal = product.price * quantity
            total_amount += subtotal

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                price=product.price,
                quantity=quantity,
                subtotal=subtotal
            )

        order.total_amount = total_amount
        order.save()

        return order


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_name', 'price', 'quantity', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'full_name',
            'phone_number',
            'email',
            'address',
            'city',
            'notes',
            'total_amount',
            'status',
            'created_at',
            'items',
        ]
        
        
class AdminOrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']