import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';
import { CategoryManager } from '../categories/category-manager';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoryManager],
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
    
    this.api.getProducts().subscribe({
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
