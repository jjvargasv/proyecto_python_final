from django.contrib import admin
from .models import Order, OrderItem
from django.http import HttpResponse, FileResponse
import csv
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

# Configuración del panel de administración para órdenes y sus ítems

# Permite ver los ítems de la orden directamente desde la página de la orden
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price', 'get_image')  # Campos solo lectura
    fields = ('product', 'get_image', 'quantity', 'price')  # Campos mostrados
    can_delete = False

    def get_image(self, obj):
        # Muestra la primera imagen del producto si existe
        if hasattr(obj.product, 'images') and obj.product.images.exists():
            image = obj.product.images.first().image
            return f'<img src="{image.url}" style="width:48px;height:48px;object-fit:cover;" />'
        return "Sin imagen"
    get_image.short_description = 'Imagen'
    get_image.allow_tags = True

# Filtro personalizado para mostrar órdenes completadas o activas
class CompletedOrderListFilter(admin.SimpleListFilter):
    title = 'historial de pedidos'
    parameter_name = 'historial'

    def lookups(self, request, model_admin):
        return (
            ('completed', 'Solo completados (histórico)'),
            ('activos', 'Solo activos (no completados)'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'completed':
            return queryset.filter(status='completed')
        if self.value() == 'activos':
            return queryset.exclude(status='completed')
        return queryset

# Configuración personalizada para el modelo Order en el admin
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]  # Permite ver ítems desde la orden
    list_display = ('id', 'user', 'nombre_completo', 'telefono', 'direccion', 'metodo_pago', 'status', 'created_at', 'total')
    list_filter = ('status', 'created_at', CompletedOrderListFilter)
    search_fields = ('user__username', 'user__perfil__nombre_completo', 'user__perfil__telefono', 'user__perfil__direccion')
    actions = ['exportar_a_excel', 'exportar_a_pdf']

    # Métodos para mostrar información adicional del perfil del usuario
    def nombre_completo(self, obj):
        return getattr(obj.user.perfil, 'nombre_completo', '') if hasattr(obj.user, 'perfil') else ''
    def telefono(self, obj):
        return getattr(obj.user.perfil, 'telefono', '') if hasattr(obj.user, 'perfil') else ''
    def direccion(self, obj):
        return getattr(obj.user.perfil, 'direccion', '') if hasattr(obj.user, 'perfil') else ''
    def metodo_pago(self, obj):
        return getattr(obj.user.perfil, 'metodo_pago', '') if hasattr(obj.user, 'perfil') else ''

    # Acciones personalizadas para exportar órdenes a Excel y PDF
    def exportar_a_excel(self, request, queryset):
        """Exporta las órdenes seleccionadas a un archivo CSV (Excel compatible)."""
        import csv
        from django.http import HttpResponse
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="ordenes.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Usuario', 'Nombre Completo', 'Teléfono', 'Dirección', 'Método de Pago', 'Estado', 'Fecha', 'Total', 'Producto', 'Cantidad', 'Precio'])
        for order in queryset:
            for item in order.items.all():
                writer.writerow([
                    order.id,
                    order.user.username,
                    self.nombre_completo(order),
                    self.telefono(order),
                    self.direccion(order),
                    self.metodo_pago(order),
                    order.status,
                    order.created_at.strftime('%Y-%m-%d %H:%M'),
                    order.total,
                    item.product.name,
                    item.quantity,
                    item.price
                ])
        return response
    exportar_a_excel.short_description = "Exportar órdenes seleccionadas a CSV"

    def exportar_a_pdf(self, request, queryset):
        """Exporta las órdenes seleccionadas a un archivo PDF con detalles de productos."""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []
        for order in queryset:
            elements.append(Paragraph(f"ORDEN #{order.id}", styles['Title']))
            elements.append(Spacer(1, 6))
            datos_cliente = [
                ["Usuario:", order.user.username],
                ["Nombre:", self.nombre_completo(order)],
                ["Teléfono:", self.telefono(order)],
                ["Dirección:", self.direccion(order)],
                ["Método de Pago:", self.metodo_pago(order)],
                ["Estado:", order.status],
                ["Fecha:", order.created_at.strftime('%Y-%m-%d %H:%M')],
                ["Total:", f"${order.total:,.2f}"],
            ]
            t_cliente = Table(datos_cliente, hAlign='LEFT', colWidths=[110, 320])
            t_cliente.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('TEXTCOLOR', (0, 0), (0, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
            ]))
            elements.append(t_cliente)
            elements.append(Spacer(1, 8))
            elements.append(Paragraph("Productos:", styles['Heading4']))
            data = [["Producto", "Cantidad", "Precio"]]
            for item in order.items.all():
                data.append([item.product.name, str(item.quantity), f"${item.price:,.2f}"])
            t = Table(data, hAlign='LEFT', colWidths=[280, 70, 80])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1f6aa5')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ]))
            elements.append(t)
            elements.append(Spacer(1, 20))
        doc.build(elements)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename="ordenes.pdf")
    exportar_a_pdf.short_description = "Exportar órdenes seleccionadas a PDF elegante"

# Registro de los modelos en el panel de administración
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
