import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse, LoginDto, RegisterDto } from '../../../models/auth.model';
import { User } from '../../../models/user.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private readonly baseUrl = environment.apiUrl;

  // Mantiene el estado del usuario actual mirando en el localstorage
  private currentUser = signal<User | null>(this.storage.getItem<User>('user'));

  // Selectores reactivos para obtener información del usuario actual
  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  user = computed(() => this.currentUser());

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      tap({
        next: (response) => {
          this.storage.setItem('auth', response.token);
          this.storage.setItem('user', response.user);
          this.currentUser.set(response.user);
        },
      }),
    );
  }

  register(data: RegisterDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, data).pipe(
      tap({
        next: (response) => {
          this.storage.setItem('auth', response.token);
          this.storage.setItem('user', response.user);
          this.currentUser.set(response.user);
        },
      }),
    );
  }

  updateCurrentUser(user: User) {
    this.storage.setItem('user', user);
    this.currentUser.set(user);
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap({
        next: () => {
          this.storage.removeItem('auth');
          this.storage.removeItem('user');
          this.currentUser.set(null);
        },
      }),
    );
  }
}
