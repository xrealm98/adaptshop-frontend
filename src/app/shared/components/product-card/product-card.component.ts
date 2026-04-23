import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  cartService = inject(CartService);
  @Input({ required: true }) product!: Product;

  itemQuantity = computed(() => {
    const item = this.cartService.cartItems().find((i) => i.id === this.product.id);
    return item?.quantity ?? 0;
  });

  addItemToCart() {
    this.cartService.addCartItem(this.product.id, false);
  }

  decrease() {
    const currentQuantity = this.itemQuantity();
    if (currentQuantity > 0) {
      this.cartService.updateQuantity(this.product.id, currentQuantity - 1);
    }
  }
}
