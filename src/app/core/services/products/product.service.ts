import { HttpClient, HttpParams } from '@angular/common/http';
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

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/products`, { params });
  }

  processCollection(res: any, sortBy: string) {
    let list: Product[] = res.data;

    if (sortBy !== 'default') {
      list = [...list].sort((a, b) =>
        sortBy === 'price_asc' ? a.price - b.price : b.price - a.price,
      );
    }

    return {
      items: list,
      total: res.total,
      currentPage: res.current_page,
      totalPages: res.last_page,
    };
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
