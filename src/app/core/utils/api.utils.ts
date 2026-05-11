import { HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../../models/paginated-response.model';

export function buildHttpParams(params: Record<string, any>): HttpParams {
  let httpParams = new HttpParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      httpParams = httpParams.set(key, value.toString());
    }
  });
  return httpParams;
}

export function normalizePaginatedResponse<T>(res: any): PaginatedResponse<T> {
  if (res?.data) return res;

  return {
    data: Array.isArray(res) ? res : [],
    current_page: 1,
    last_page: 1,
    total: res?.length || 0,
    per_page: res?.length || 0,
  };
}
