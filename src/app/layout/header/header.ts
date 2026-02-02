import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart';
import { CommonModule } from '@angular/common'; 
import { ApiService } from '../../core/services/api.service'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css', 
})
export class Header {
  cartService = inject(CartService);
  public api = inject(ApiService); 
  cd = inject(ChangeDetectorRef);
  
  isMenuOpen = false;

  isUserDropdownOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }


    toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  // Función para cerrar sesión y cerrar menú a la vez
  logout() {
    this.api.logout();
    this.closeMenu();
    this.cd.detectChanges(); 
  }
}