from django.contrib import admin
from .models import Order, OrderItem

# Register your models here.

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('id', 'user', 'status', 'created_at', 'total')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username',)

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
