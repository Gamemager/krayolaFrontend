import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { ApiService } from '../../../core/services/api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-category-selection',
  standalone: true, // Asumo que usas standalone
  imports: [CommonModule, RouterLink], // Agregar CommonModule
  templateUrl: './category-selection.html',
  styleUrl: './category-selection.css',
})

export class CategorySelection implements OnInit {
  
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  categories: any[] = [];
  isLoading = true;

  ngOnInit() {
    console.log('Iniciando carga de categorías...');

    this.api.getCategories().subscribe({
      next: (data) => {
        
        // Asegurarnos de que sea un array
        if (Array.isArray(data)) {
          this.categories = data;
        }
        
        this.isLoading = false;
        this.cdr.detectChanges(); // Forzar actualización de la vista
      },
      error: (e) => {
        console.error('Error FATAL conectando al backend:', e);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper para asignar imagen según categoría (Ya que la BD solo tiene nombre)
  getCategoryImage(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes('moto')) return 'assets/images/cat-motos.jpg';
    if (name.includes('relo')) return 'assets/images/cat-relojes.jpg';
    return 'assets/images/hero-bg.jpg'; // Default
  }
}