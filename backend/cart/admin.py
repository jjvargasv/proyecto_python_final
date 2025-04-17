from django.contrib import admin
from .models import Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

class CartAdmin(admin.ModelAdmin):
    inlines = [CartItemInline]
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__username',)

admin.site.register(Cart, CartAdmin)
admin.site.register(CartItem)
