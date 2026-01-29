import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css', // Asegúrate que sea styleUrl (Angular 17+) o styleUrls
})
export class Header {
  public cartService = inject(CartService);

  // Variable de estado para controlar el menú
  isMenuOpen = false;

  /**
   * Alterna el estado (para el botón hamburguesa)
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Cierra el menú forzosamente (para los enlaces)
   */
  closeMenu() {
    this.isMenuOpen = false;
  }
}