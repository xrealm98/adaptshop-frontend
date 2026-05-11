import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../models/paginated-response.model';
import { User } from '../../../models/user.model';
import { buildHttpParams, normalizePaginatedResponse } from '../../utils/api.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getUsers(params: any = {}): Observable<PaginatedResponse<User>> {
    const httpParams = buildHttpParams(params);
    return this.http
      .get<any>(`${this.baseUrl}/users`, { params: httpParams })
      .pipe(map((res) => normalizePaginatedResponse<User>(res)));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, data);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/profile`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
