import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../../../core/services/order/orders.service';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-form',
  imports: [ReactiveFormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss',
})
export class OrderForm {
  private fb = inject(FormBuilder);
  private orderService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  orderId: number | null = null;
  order?: Order;

  orderForm = this.fb.nonNullable.group({
    status: ['', Validators.required],
    shipping_street: ['', Validators.required],
    shipping_city: ['', Validators.required],
    shipping_province: ['', Validators.required],
    shipping_postal_code: ['', Validators.required],
    shipping_country: ['', Validators.required],
  });

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.params['id']);
    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = order;
          this.orderForm.patchValue({
            status: order.status,
            shipping_street: order.shipping_street,
            shipping_city: order.shipping_city,
            shipping_province: order.shipping_province,
            shipping_postal_code: order.shipping_postal_code,
            shipping_country: order.shipping_country,
          });
        },
        error: (err) => console.error('Error al cargar el pedido', err),
      });
    }
  }

  onSubmit() {
    if (this.orderForm.invalid || !this.orderId) return;
    const data = this.orderForm.getRawValue() as Partial<Order>;
    this.orderService.updateOrder(this.orderId, data).subscribe({
      next: () => this.router.navigate(['/admin/orders']),
      error: (err) => console.error('Error al actualizar', err),
    });
  }

  goBack() {
    this.router.navigate(['/admin/orders']);
  }
}
