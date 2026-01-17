import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CartService } from '../../../core/services/cart';
import { Router } from '@angular/router'; 
import { Toast } from '../../../Shared/components/toast/toast';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, Toast],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {

  @ViewChild(Toast) toast!: Toast;

  private router = inject(Router);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  product: any | undefined;
  parsedSpecs: any = {};
  isLoading = true;

  ngOnInit() {
    this.route.params.subscribe(params => {
      // Reiniciar estado al cambiar de producto
      this.isLoading = true;
      this.product = undefined;
      this.cdr.detectChanges();

      const id = +params['id'];
      
      if (id) {
        this.loadProduct(id);
      } else {
        // Si no hay ID válido, detener carga
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

loadProduct(id: number) {
    this.api.getProductById(id).subscribe({
      next: (data) => {
        console.log('✅ Producto cargado:', data);
        this.product = data;
        
        // PARSEAR ESPECIFICACIONES
        if (this.product.specifications) {
          try {
            // Si es un string, lo convertimos a objeto
            if (typeof this.product.specifications === 'string') {
              this.parsedSpecs = JSON.parse(this.product.specifications);
            } else {
              // Si ya viniera como objeto (por si acaso)
              this.parsedSpecs = this.product.specifications;
            }
          } catch (e) {
            console.error('Error parseando especificaciones', e);
            this.parsedSpecs = {};
          }
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('❌ Error cargando producto:', e);
        this.isLoading = false; // Importante: dejar de cargar aunque falle
        this.cdr.detectChanges();
      }
    });
  }

    get objectKeys() {
    return Object.keys(this.parsedSpecs);
  }


addToCart() {
  if (this.product) {
    // 1. Preguntar al servicio cuántos tengo ya en el carrito
    const currentQty = this.cartService.getQuantityInCart(this.product.id);
    
    // 2. Validar suma (Lo que tengo + 1 que quiero agregar > Stock real)
    if (currentQty + 1 > this.product.stock) {
        this.toast.message = `Solo hay ${this.product.stock} unidades disponibles.`;
        this.toast.show();
        return;
    }

    // 3. Si pasa la validación, procedemos
    const added = this.cartService.addToCart(this.product);
    
    if (added) {
      // Abrir el sidebar
      const cartOffcanvas = document.getElementById('cartOffcanvas');
      if (cartOffcanvas) {
          // @ts-ignore
          const bsOffcanvas = new bootstrap.Offcanvas(cartOffcanvas);
          bsOffcanvas.show();
      }
    }
  }
}
}