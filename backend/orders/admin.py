from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'price', 'quantity', 'subtotal')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'full_name',
        'phone_number',
        'city',
        'total_amount',
        'status',
        'created_at',
    )
    list_filter = ('status', 'city', 'created_at')
    search_fields = ('full_name', 'phone_number', 'email', 'address')
    list_editable = ('status',)
    readonly_fields = ('total_amount', 'created_at')
    inlines = [OrderItemInline]

    fieldsets = (
        ('Customer Information', {
            'fields': ('full_name', 'phone_number', 'email', 'address', 'city', 'notes')
        }),
        ('Order Details', {
            'fields': ('total_amount', 'status', 'created_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'price', 'quantity', 'subtotal')
    readonly_fields = ('order', 'product', 'product_name', 'price', 'quantity', 'subtotal')