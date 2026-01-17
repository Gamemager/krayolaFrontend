import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-cart', // Asegúrate de poner este selector en tu app.component.html luego
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cartService = inject(CartService);
  
  // Getter para usar el observable directamente en el HTML con el pipe async
  items$ = this.cartService.items$;

  increase(id: number) { this.cartService.updateQuantity(id, 1); }
  decrease(id: number) { this.cartService.updateQuantity(id, -1); }
  remove(id: number) { this.cartService.removeFromCart(id); }
  
checkout() {
  this.cartService.createPreference().subscribe({
    next: (res) => {
      // Redirigir a Mercado Pago
      if (res.id) {
        window.location.href = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${res.id}`;
        // Nota: El dominio .com.co cambia según tu país (.com.ar, .com.mx) o usa init_point si el backend lo devuelve.
      }
    },
    error: (err) => console.error('Error iniciando pago', err)
  });
}
}
