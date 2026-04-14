import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../../core/services/order/orders.service';
import { Order } from '../../../models/order.model';
import { TableHeader } from '../components/table-header/table-header';

@Component({
  selector: 'app-orders.component',
  imports: [RouterLink, TableHeader, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private orderService = inject(OrdersService);
  orders = signal<Order[]>([]);
  searchTerm = signal('');

  ngOnInit() {
    this.loadOrders();
  }

  filteredOrders = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.orders();
    return this.orders().filter(
      (o) =>
        o.id.toString().includes(term) ||
        o.user?.first_name.toLowerCase().includes(term) ||
        o.shipping_city.toLowerCase().includes(term),
    );
  });
  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      },
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
  }
  getStatusStyles(status: string): string {
    const baseStyles = 'px-2 py-1 text-xs font-medium rounded-full';

    const statusMap: Record<string, string> = {
      pending: `${baseStyles} bg-yellow-100 text-yellow-700`,
      paid: `${baseStyles} bg-blue-100 text-blue-700`,
      shipped: `${baseStyles} bg-purple-100 text-purple-700`,
      delivered: `${baseStyles} bg-green-100 text-green-700`,
      cancelled: `${baseStyles} bg-red-100 text-red-700`,
    };

    return statusMap[status] || `${baseStyles} bg-gray-100 text-gray-700`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      paid: 'Pagado',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  }
}
