import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Order } from '../../../models/order.model';
import { PaginatedResponse } from '../../../models/paginated-response.model';
import { buildHttpParams, normalizePaginatedResponse } from '../../utils/api.utils';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getOrders(params: any = {}): Observable<PaginatedResponse<Order>> {
    const httpParams = buildHttpParams(params);
    return this.http
      .get<any>(`${this.baseUrl}/orders`, { params: httpParams })
      .pipe(map((res) => normalizePaginatedResponse<Order>(res)));
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/orders/${id}`);
  }

  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders`, orderData);
  }

  updateOrder(id: number, orderData: Partial<Order>): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/orders/${id}/status`, orderData);
  }
}
