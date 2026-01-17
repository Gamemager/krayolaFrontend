import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); // Inyectar

  categoryTitle: string = 'Catálogo';
  products: any[] = [];
  isLoading = true;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.isLoading = true;
      this.products = []; // Limpiar lista anterior
      this.cdr.detectChanges(); // Actualizar vista para mostrar spinner

      const categoryId = +params['category']; 

      console.log('Cargando productos para categoría:', categoryId); // Debug

      this.api.getProducts().subscribe({
        next: (allProducts) => {
          console.log('Productos recibidos:', allProducts); // Debug
          
          // Filtrar
          this.products = allProducts.filter(p => p.category_id === categoryId);
          
          // Título Dinámico
          this.categoryTitle = categoryId === 1 ? 'Repuestos de Motos' : 
                               categoryId === 2 ? 'Relojería Exclusiva' : 'Catálogo';
          
          this.isLoading = false;
          this.cdr.detectChanges(); // <--- FORZAR ACTUALIZACIÓN
        },
        error: (e) => {
          console.error('Error cargando productos:', e);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }
}