import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getProducts(params?: {
    category_id?: number;
    latest?: boolean;
    limit?: number;
  }): Observable<Product[]> {
    let url = `${this.baseUrl}/products?`;

    if (params?.category_id) url += `category_id=${params.category_id}&`;
    if (params?.latest) url += `latest=true&`;
    if (params?.limit) url += `limit=${params.limit}&`;

    return this.http.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/products`, data);
  }

  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/products/${id}`);
  }
}
