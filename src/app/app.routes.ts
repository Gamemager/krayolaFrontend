import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./Features/home/home').then(m => m.Home)
      },
      {
        path: 'tienda',
        loadChildren: () => import('./Features/shop/shop.routes').then(m => m.SHOP_ROUTES)
      },
      {
        path: 'carrito',
        loadComponent: () => import('./Features/cart/cart').then(m => m.CartComponent)
      },
    //   {
    //     path: 'nosotros', // Información sobre Krayola Store
    //     loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
    //   }
    ]
  },
//   {
//     path: 'auth',
//     loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
//   },
  { path: '**', redirectTo: '' } // Ruta 404
];