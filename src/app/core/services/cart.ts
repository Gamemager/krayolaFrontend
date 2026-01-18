import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';


export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number; // Para validar no exceder inventario
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  private http: HttpClient = inject(HttpClient);

createPreference() {
  return this.http.post<any>('https://krayolabackend-production.up.railway.app/api/payments/create_preference', { 
    items: this.currentItems 
  });
}
  // Estado inicial vacío
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  // Observable que los componentes pueden "escuchar"
  items$ = this.itemsSubject.asObservable();

  constructor() {
    // Recuperar carrito del LocalStorage al iniciar (para no perder datos al recargar)
    const savedCart = localStorage.getItem('krayola_cart');
    if (savedCart) {
      this.itemsSubject.next(JSON.parse(savedCart));
    }
  }
  /** Obtener la cantidad actual de un producto específico en el carrito */
  getQuantityInCart(productId: number): number {
    const item = this.currentItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  }
    
  // --- MÉTODOS PÚBLICOS ---

  get currentItems() {
    return this.itemsSubject.value;
  }

  /** Agregar producto al carrito */
  addToCart(product: any) {
    const currentItems = this.currentItems;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      // Si ya existe, aumentamos cantidad (si hay stock)
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
        this.updateCart([...currentItems]);
        return true; // Agregado con éxito
      } else {
        return false; // No hay más stock
      }
    } else {
      // Si es nuevo, lo agregamos con cantidad 1
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: Number(product.price), // Asegurar que sea número
        image_url: product.image_url,
        quantity: 1,
        stock: product.stock
      };
      this.updateCart([...currentItems, newItem]);
      return true;
    }
  }

  /** Eliminar un producto completo */
  removeFromCart(productId: number) {
    const filteredItems = this.currentItems.filter(item => item.id !== productId);
    this.updateCart(filteredItems);
  }

  /** Aumentar o disminuir cantidad (+/-) */
  updateQuantity(productId: number, change: number) {
    const items = this.currentItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        // Validar límites (mínimo 1, máximo stock)
        if (newQuantity >= 1 && newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    this.updateCart(items);
  }

  /** Vaciar carrito (ej. al pagar) */
  clearCart() {
    this.updateCart([]);
  }

  /** Calcular Total ($) */
  get total() {
    return this.currentItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /** Calcular Cantidad de Items (para el badge del icono) */
  get count() {
    return this.currentItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // --- PRIVADO ---
  private updateCart(items: CartItem[]) {
    this.itemsSubject.next(items);
    localStorage.setItem('krayola_cart', JSON.stringify(items));
  }
}
