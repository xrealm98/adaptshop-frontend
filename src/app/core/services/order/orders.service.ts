import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}`, orderData);
  }

  updateOrder(id: number, orderData: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/orders/${id}/status`, orderData);
  }
}
