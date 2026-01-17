import { Routes } from '@angular/router';
import { CategorySelection} from './category-selection/category-selection';
import { ProductList } from './product-list/product-list';
import { ProductDetail } from './product-detail/product-detail';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    component: CategorySelection, // /tienda -> Muestra las 2 opciones
    title: 'Selecciona una Categoría - Krayola Store'
  },
  {
    path: ':category', // /tienda/motos o /tienda/relojes
    component: ProductList,
    title: 'Catálogo de Productos'
  },
  {
    path: 'producto/:id', // /tienda/producto/reloj-casio
    component: ProductDetail,
    title: 'Detalle del Producto'
  }
];