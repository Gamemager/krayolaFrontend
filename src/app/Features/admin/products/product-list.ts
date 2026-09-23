import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); // 2. Inyectar CDR
  
  products: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    
    this.api.getProducts(true).subscribe({
      next: (data) => {
        console.log('Productos cargados:', data); // Debug
        this.products = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // 3. FORZAR ACTUALIZACIÓN DE VISTA
      },
      error: (err) => {
        console.error('Error cargando productos', err);
        this.isLoading = false;
        this.cdr.detectChanges(); // 3. FORZAR AQUÍ TAMBIÉN
      }
    });
  }

  toggleStatus(product: any) {
    const willBeActive = !product.active;
    this.api.toggleProductStatus(product.id).subscribe({
      next: () => {
        product.active = willBeActive;
        this.cdr.detectChanges();
        Swal.fire({
          icon: 'success',
          title: willBeActive ? 'Producto activado' : 'Producto inhabilitado',
          timer: 1200,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cambiar el estado del producto', 'error');
      }
    });
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
            this.loadProducts(); 
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }
}
