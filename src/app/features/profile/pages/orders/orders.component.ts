import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { getOrderStatusInfo } from '../../../../core/constants/order-status.config';
import { OrdersService } from '../../../../core/services/order/orders.service';
import { Order } from '../../../../models/order.model';
@Component({
  selector: 'app-orders.component',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  public orderService = inject(OrdersService);
  public getStatusInfo = getOrderStatusInfo;

  orders = signal<Order[]>([]);
  orderId = signal<number | null>(null);

  ngOnInit() {
    this.loadOrders();
  }
  openOrder(id: number) {
    this.orderId.update((currentId) => (currentId === id ? null : id));
  }
  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
      },
      error: (err) => console.error('Error cargando pedidos', err),
    });
  }
}
