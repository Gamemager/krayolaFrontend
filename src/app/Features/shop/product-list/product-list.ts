import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  categoryTitle: string = 'Catálogo';
  
  allProductsInCategory: any[] = []; 
  displayedProducts: any[] = [];
  
  isLoading = true;

  // Filtros
  availableBrands: string[] = []; 
  selectedBrand: string = 'Todas';

  ngOnInit() {
    this.route.params.subscribe(params => {
      // 1. Resetear todo al cambiar de ruta
      this.isLoading = true;
      this.allProductsInCategory = [];
      this.displayedProducts = [];
      this.availableBrands = [];
      this.selectedBrand = 'Todas';
      this.cdr.detectChanges(); // Mostrar spinner ya

      const categoryId = +params['category']; 

      this.api.getProducts().subscribe({
        next: (apiResponse) => {
          
          // 2. Procesamiento Seguro
          this.allProductsInCategory = apiResponse
            .filter(p => p.category_id === categoryId)
            .map(product => {
              let specs: any = {};
              
              // Parsing defensivo:
              try {
                if (product.specifications) {
                  if (typeof product.specifications === 'string') {
                    // Solo parsear si parece un JSON válido (empieza con { o [)
                    if (product.specifications.trim().startsWith('{') || product.specifications.trim().startsWith('[')) {
                       specs = JSON.parse(product.specifications);
                    }
                  } else if (typeof product.specifications === 'object') {
                    specs = product.specifications;
                  }
                }
              } catch (e) {
                console.warn('Specs inválidas para producto ID:', product.id);
                // No reventamos, simplemente specs queda vacío {}
              }
              
              // Normalización de marca
              // Si no encuentra marca, le pone 'Generico' u 'Otras' para que no quede vacío
              const rawBrand = specs.marca || specs.Marca || specs.brand || 'Otras';
              
              return {
                ...product,
                parsedSpecs: specs,
                brandName: this.capitalizeFirstLetter(rawBrand) // Estética: "casio" -> "Casio"
              };
            });

          // 3. Extraer marcas únicas
          const brandsSet = new Set(this.allProductsInCategory.map(p => p.brandName));
          // Convertir a array y ordenar alfabéticamente
          this.availableBrands = Array.from(brandsSet).sort();

          // 4. Mostrar
          this.displayedProducts = [...this.allProductsInCategory];
          
          this.categoryTitle = categoryId === 1 ? 'Repuestos de Motos' : 
                               categoryId === 2 ? 'Relojería Exclusiva' : 'Catálogo';
          
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (e) => {
          console.error('Error fatal cargando productos:', e);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  filterProducts(brand: string) {
    this.selectedBrand = brand; // Actualizamos la selección
    
    if (brand === 'Todas') {
      this.displayedProducts = [...this.allProductsInCategory];
    } else {
      this.displayedProducts = this.allProductsInCategory.filter(
        p => p.brandName === brand
      );
    }
  }

  // Helper para que se vea bonito
  private capitalizeFirstLetter(string: string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}