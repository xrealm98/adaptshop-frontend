import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = signal(false);
  private activeRequests = 0;
  private timer: any;

  show() {
    this.activeRequests++;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.activeRequests > 0) this.isLoading.set(true);
    }, 500);
  }

  hide() {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    if (this.activeRequests === 0) {
      clearTimeout(this.timer);
      this.isLoading.set(false);
    }
  }
}
