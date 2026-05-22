import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info';
export interface Notification {
  message: string;
  type: NotificationType;
}
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notification = signal<Notification | null>(null);
  private timer: any = null;

  showSuccess(message: string) {
    this.show({ message, type: 'success' });
  }

  showError(message: string) {
    this.show({ message, type: 'error' });
  }

  showInfo(message: string) {
    this.show({ message, type: 'info' });
  }

  clear(): void {
    this.notification.set(null);
    this.timer = null;
  }

  private show(notification: Notification): void {
    clearTimeout(this.timer);
    this.notification.set(notification);
    this.timer = setTimeout(() => this.clear(), 4000);
  }
}
