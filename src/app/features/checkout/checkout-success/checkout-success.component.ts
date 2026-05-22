import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-checkout-success',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent {
  private router = inject(Router);
  order: Order | null = null;

  ngOnInit() {
    this.order = history.state.order;
    if (!this.order) {
      this.router.navigate(['/']);
    }
  }
}
