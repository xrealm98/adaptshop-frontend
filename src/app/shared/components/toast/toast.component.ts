import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification/notification.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  private service = inject(NotificationService);
  notification = this.service.notification;

  close() {
    this.service.clear();
  }
}
