import { Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../../core/services/categories/category.service';
import { OrdersService } from '../../../core/services/order/orders.service';
import { ProductService } from '../../../core/services/products/product.service';
import { UserService } from '../../../core/services/users/user.service';

@Component({
  selector: 'app-dashboard.component',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private orderService = inject(OrdersService);
  private productService = inject(ProductService);
  private userService = inject(UserService);
  private categoryService = inject(CategoryService);

  total = signal({
    orders: 0,
    products: 0,
    users: 0,
    categories: 0,
    revenue: 0,
  });

  ngOnInit() {
    forkJoin({
      orders: this.orderService.getOrders(),
      products: this.productService.getProducts(),
      users: this.userService.getUsers(),
      categories: this.categoryService.getCategories(),
    }).subscribe({
      next: (res) => {
        const totalRevenue = res.orders.reduce((acc, order) => acc + Number(order.total), 0);
        this.total.set({
          orders: res.orders.length,
          products: res.products.total,
          users: res.users.length,
          categories: res.categories.length,
          revenue: totalRevenue,
        });
      },
    });
  }
}
