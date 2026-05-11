import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getOrderStatusInfo } from '../../../../core/constants/order-status.config';
import { OrdersService } from '../../../../core/services/order/orders.service';
import { Order } from '../../../../models/order.model';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
@Component({
  selector: 'app-orders.component',
  imports: [DatePipe, PaginationComponent, CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  public orderService = inject(OrdersService);
  private title = inject(Title);
  public getStatusInfo = getOrderStatusInfo;
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);

  orders = signal<Order[]>([]);
  orderId = signal<number | null>(null);

  ngOnInit() {
    this.title.setTitle(`Perfil | Pedidos`);
    this.loadOrders();
  }
  openOrder(id: number) {
    this.orderId.update((currentId) => (currentId === id ? null : id));
  }
  loadOrders() {
    this.orderService.getOrders({ page: this.currentPage(), per_page: 5 }).subscribe({
      next: (orders) => {
        this.orders.set(orders.data);
        this.totalPages.set(orders.last_page);
      },
      error: (err) => console.error('Error cargando pedidos', err),
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadOrders();
  }
}
