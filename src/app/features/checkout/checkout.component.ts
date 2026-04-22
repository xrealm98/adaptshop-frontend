import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';
import { CartService } from '../../core/services/cart/cart.service';
import { OrdersService } from '../../core/services/order/orders.service';
import { PaymentService } from '../../core/services/payment/payment.service';
import { UserService } from '../../core/services/users/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private orderService = inject(OrdersService);
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  public userService = inject(UserService);
  private location = inject(Location);
  private title = inject(Title);
  private router = inject(Router);

  stripe: Stripe | null = null;
  cardElement: StripeCardElement | null = null;

  form: FormGroup = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    shipping_street: ['', Validators.required],
    shipping_city: ['', Validators.required],
    shipping_province: ['', Validators.required],
    shipping_postal_code: ['', Validators.required],
    shipping_country: ['', Validators.required],
    save_data: [false],
  });

  async ngOnInit() {
    this.loadUser();
    this.title.setTitle(`Pago`);
    this.stripe = await loadStripe(environment.stripePublicKey);
    const elements = this.stripe?.elements();
    const card = elements?.create('card');
    if (card) {
      this.cardElement = card;
      this.cardElement.mount('#card-element');
    }
  }

  loadUser() {
    const user = this.authService.user();
    if (user) {
      this.form.patchValue({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        shipping_street: user.street || '',
        shipping_city: user.city || '',
        shipping_province: user.province || '',
        shipping_postal_code: user.postal_code || '',
        shipping_country: user.country || '',
        save_data: false,
      });
    }
  }

  onPay() {
    if (this.form.invalid || !this.stripe || !this.cardElement) return;

    this.paymentService
      .createPaymentIntent(this.cartService.cartItems())
      .pipe(
        switchMap((res) =>
          this.paymentService.confirmPayment(this.stripe!, res.client_secret, this.cardElement!),
        ),
        switchMap((result) => this.handlePaymentResult(result)),
      )
      .subscribe({
        next: () => this.onSuccess(),
        error: (error) => alert(error.message),
      });
  }

  private getOrderData(paymentIntentId: string) {
    const { save_data, first_name, last_name, email, ...shippingData } = this.form.value;
    return {
      ...shippingData,
      payment_intent_id: paymentIntentId,
      items: this.cartService.cartItems().map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
  }

  private processOrder(paymentId: string) {
    const orderData = this.getOrderData(paymentId);

    if (this.form.value.save_data) {
      const profileData: Partial<User> = {
        first_name: this.form.value.first_name,
        last_name: this.form.value.last_name,
        street: this.form.value.shipping_street,
        city: this.form.value.shipping_city,
        province: this.form.value.shipping_province,
        postal_code: this.form.value.shipping_postal_code,
        country: this.form.value.shipping_country,
      };

      return this.userService.updateProfile(profileData).pipe(
        switchMap((updatedUser) => {
          this.authService.updateCurrentUser(updatedUser);
          return this.orderService.createOrder(orderData);
        }),
      );
    }

    return this.orderService.createOrder(orderData);
  }

  private handlePaymentResult(result: any) {
    if (result.error) throw new Error(result.error.message);
    return this.processOrder(result.paymentIntent!.id);
  }

  private onSuccess() {
    alert('¡Pedido realizado con éxito!');
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }

  goBack() {
    this.location.back();
  }
}
