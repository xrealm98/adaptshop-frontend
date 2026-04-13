import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../../../core/services/order/orders.service';
import { Order } from '../../../models/order.model';
import { TableHeader } from '../components/table-header/table-header';

@Component({
  selector: 'app-orders.component',
  imports: [RouterLink, TableHeader],
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
      (o) => o.id.toString().includes(term) || o.shipping_city.toLowerCase().includes(term),
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
}
