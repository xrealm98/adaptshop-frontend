import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getOrderStatusInfo } from '../../../core/constants/order-status.config';
import { OrdersService } from '../../../core/services/order/orders.service';
import { Order } from '../../../models/order.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { TableHeader } from '../components/table-header/table-header';
import { TableComponent } from '../components/table/table.component';

@Component({
  selector: 'app-orders.component',
  imports: [RouterLink, TableHeader, TableComponent, PaginationComponent, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  private orderService = inject(OrdersService);
  public getStatusInfo = getOrderStatusInfo;
  orders = signal<Order[]>([]);
  searchTerm = signal('');
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'user', header: 'Cliente', sortable: true },
    { key: 'created_at', header: 'Fecha', sortable: true },
    { key: 'total', header: 'Total', sortable: true },
    { key: 'status', header: 'Estado', sortable: true },
    { key: 'actions', header: 'Acciones', sortable: false },
  ];

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
        o.shipping_city.toLowerCase().includes(term) ||
        o.status.toLowerCase().includes(term),
    );
  });
  loadOrders() {
    this.orderService.getOrders({ page: this.currentPage(), per_page: 10 }).subscribe({
      next: (orders) => {
        this.orders.set(orders.data);
        this.totalPages.set(orders.last_page);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      },
    });
  }

  onSearch(value: string) {
    this.searchTerm.set(value);
    this.currentPage.set(1);
    this.loadOrders();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadOrders();
  }
}
