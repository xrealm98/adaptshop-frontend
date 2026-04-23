import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Stripe, StripeCardElement } from '@stripe/stripe-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  createPaymentIntent(items: any[]): Observable<{ client_secret: string }> {
    return this.http.post<{ client_secret: string }>(`${this.baseUrl}/checkout/payment`, {
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    });
  }

  confirmPayment(stripe: Stripe, clientSecret: string, cardElement: StripeCardElement) {
    return from(
      stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      }),
    );
  }
}
