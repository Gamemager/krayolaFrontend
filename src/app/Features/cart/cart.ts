import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cartService = inject(CartService);
  
  items$ = this.cartService.items$;

  increase(id: number) { this.cartService.updateQuantity(id, 1); }
  decrease(id: number) { this.cartService.updateQuantity(id, -1); }
  remove(id: number) { this.cartService.removeFromCart(id); }
  
checkout() {
  this.cartService.createPreference().subscribe({
    next: (res) => {
      if (res.id) {
        window.location.href = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${res.id}`;
      }
    },
    error: (err) => console.error('Error iniciando pago', err)
  });
}
}
