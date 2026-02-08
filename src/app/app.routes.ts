import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
// Importamos el guard (aunque aún no lo usamos en una ruta admin, ya lo tenemos listo)
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', loadComponent: () => import('./Features/home/home').then(m => m.Home) },
      { path: 'tienda', loadChildren: () => import('./Features/shop/shop.routes').then(m => m.SHOP_ROUTES) },
      { 
        path: 'misCompras', 
        loadComponent: () => import('./Features/client/client-orders/client-orders').then(m => m.ClientOrdersComponent),
        canActivate: [authGuard] 
      },
      {
        path: 'auth',
        children: [
          { path: 'login', loadComponent: () => import('./Features/auth/login/login').then(m => m.Login) },
          { path: 'registro', loadComponent: () => import('./Features/auth/register/register').then(m => m.Register) }
        ]
      }
    ]
  },
  
  // Panel de Admin 
  {
    path: 'admin',
    canActivate: [adminGuard], // Protección
    loadComponent: () => import('./Features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent),
    children: [
      // 1. Redirigir al resumen por defecto
      { path: '', redirectTo: 'resumen', pathMatch: 'full' }, 
      
      // 2. Vista de Resumen (Tarjetas, Gráficos) 
      { 
        path: 'resumen', 
        loadComponent: () => import('./Features/admin/dashboard-home/dashboard-home').then(m => m.DashboardHome) 
      },

      // 3. Gestión de Productos
      {
        path: 'productos',
        loadComponent: () => import('./Features/admin/products/product-list').then(m => m.ProductList)
      },
      {
        path: 'productos/nuevo',
        loadComponent: () => import('./Features/admin/products/product-form').then(m => m.ProductForm)
      },
      {
        path: 'productos/editar/:id',
        loadComponent: () => import('./Features/admin/products/product-form').then(m => m.ProductForm)
      },
      
      // 4. Gestión de Usuarios
      {
        path: 'usuarios',
        loadComponent: () => import('./Features/admin/users/user-list').then(m => m.UserList)
      },
      // 5. Gestión de Ventas
      {
        path: 'ventas',
        loadComponent: () => import('./Features/admin/sales-list/sales-list').then(m => m.SalesListComponent)
      }
    ]
  },

  // Fallback (404)
  { path: '**', redirectTo: '' }
];
