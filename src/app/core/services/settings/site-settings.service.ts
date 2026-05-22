import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppSettings } from '../../../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;

  settings = signal<AppSettings>({});

  loadSettings() {
    return this.http
      .get<AppSettings>(`${this.apiUrl}/settings`)
      .pipe(tap((res) => this.settings.set(res)));
  }
  updateSettings(key: string, value: any) {
    return this.http
      .put<AppSettings>(`${this.apiUrl}/settings`, {
        settings: { [key]: value },
      })
      .pipe(tap((res) => this.settings.set(res)));
  }
}
