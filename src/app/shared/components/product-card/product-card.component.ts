import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  cartService = inject(CartService);
  private notificationService = inject(NotificationService);
  @Input({ required: true }) product!: Product;

  isMaxStockReached = computed(() => {
    return this.itemQuantity() >= this.product.stock;
  });
  itemQuantity = computed(() => {
    const item = this.cartService.cartItems().find((i) => i.id === this.product.id);
    return item?.quantity ?? 0;
  });

  addItemToCart() {
    if (this.isMaxStockReached()) {
      this.notificationService.showError(
        `Límite de stock alcanzado (${this.product.stock} unidades)`,
      );
      return;
    }
    this.cartService.addCartItem(this.product.id, false);
    this.notificationService.showSuccess(`${this.product.name} añadido al carrito`);
  }

  decrease() {
    const currentQuantity = this.itemQuantity();
    if (currentQuantity > 0) {
      this.cartService.updateQuantity(this.product.id, currentQuantity - 1);
      if (currentQuantity - 1 == 0) {
        this.notificationService.showSuccess(`${this.product.name} eliminado del carrito`);
      }
    }
  }
}
