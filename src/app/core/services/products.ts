import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  category: 'motos' | 'relojes'; // Solo estas dos por ahora
  price: number;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // Base de datos simulada
  private products: Product[] = [
    // MOTOS
    // {
    //   id: 1,
    //   name: 'Kit de Arrastre Pulsar NS 200',
    //   category: 'motos',
    //   price: 120000,
    //   image: 'assets/images/products/kit-arrastre.jpg', 
    //   description: 'Kit completo reforzado marca Cassarella.'
    // },
    // {
    //   id: 2,
    //   name: 'Aceite Motul 7100 10W40',
    //   category: 'motos',
    //   price: 55000,
    //   image: 'assets/images/products/aceite-motul.jpg',
    //   description: 'Aceite 100% sintético para alto rendimiento.'
    // },
    // // RELOJES
    // {
    //   id: 3,
    //   name: 'Casio G-Shock Negro',
    //   category: 'relojes',
    //   price: 450000,
    //   image: 'assets/images/products/gshock.jpg',
    //   description: 'Resistente a impactos y agua 200M.'
    // },
    // {
    //   id: 4,
    //   name: 'Reloj Curren Cronógrafo',
    //   category: 'relojes',
    //   price: 180000,
    //   image: 'assets/images/products/curren.jpg',
    //   description: 'Elegancia y precisión con correa de cuero.'
    // }
  ];

  constructor() { }

  // Obtener productos filtrados por categoría
  getProductsByCategory(category: string) {
    return this.products.filter(p => p.category === category);
  }

  // Obtener un solo producto por ID (para el detalle)
  getProductById(id: number) {
    return this.products.find(p => p.id === id);
  }
}