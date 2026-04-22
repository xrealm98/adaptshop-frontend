import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  cartService = inject(CartService);
  private router = inject(Router);
  private location = inject(Location);

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  goBack() {
    this.location.back();
  }
}
