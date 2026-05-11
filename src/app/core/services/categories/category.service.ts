import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { buildHttpParams, normalizePaginatedResponse } from '../../../core/utils/api.utils';
import { Category } from '../../../models/category.model';
import { PaginatedResponse } from '../../../models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCategories(params: any = {}): Observable<PaginatedResponse<Category>> {
    const httpParams = buildHttpParams(params);
    return this.http
      .get<any>(`${this.baseUrl}/categories`, { params: httpParams })
      .pipe(map((res) => normalizePaginatedResponse<Category>(res)));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }
}
