import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/shop-layout/shop-layout').then((m) => m.ShopLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('./features/products/pages/product-detail/product-detail.component').then(
            (m) => m.ProductDetailComponent,
          ),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/profile/profile-layout.component').then(
            (m) => m.ProfileLayoutComponent,
          ),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'perfil', pathMatch: 'full' },
          {
            path: 'profile',
            loadComponent: () =>
              import('./features/profile/pages/info/info.component').then((m) => m.InfoComponent),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./features/profile/pages/orders/orders.component').then(
                (m) => m.OrdersComponent,
              ),
          },
        ],
      },
      {
        path: 'catalog',
        loadComponent: () =>
          import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
      },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/products/products.component').then((m) => m.ProductsComponent),
      },
      {
        path: 'products/create',
        loadComponent: () =>
          import('./features/admin/products/product/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'products/edit/:id',
        loadComponent: () =>
          import('./features/admin/products/product/product-form').then((m) => m.ProductForm),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/admin/categories/categories.component').then(
            (m) => m.CategoriesComponent,
          ),
      },
      {
        path: 'categories/create',
        loadComponent: () =>
          import('./features/admin/categories/category/category-form').then((m) => m.CategoryForm),
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import('./features/admin/categories/category/category-form').then((m) => m.CategoryForm),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'orders/edit/:id',
        loadComponent: () =>
          import('./features/admin/orders/order/order-form').then((m) => m.OrderForm),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./features/admin/users/user/user-form').then((m) => m.UserForm),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
