import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-manager.html',
  styleUrl: './category-manager.scss',
})
export class CategoryManager implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  categories: any[] = [];
  showForm = false;
  catForm: FormGroup;

  constructor() {
    this.catForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.catForm.reset();
  }

  onSubmit() {
    if (this.catForm.invalid) return;
    
    this.api.createCategory(this.catForm.value).subscribe({
      next: () => {
        Swal.fire({
            title: '¡Éxito!',
            text: 'Categoría creada correctamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        this.loadCategories();
        this.toggleForm();
      },
      error: () => Swal.fire('Error', 'No se pudo crear la categoría', 'error')
    });
  }

  deleteCategory(id: number) {
    Swal.fire({
      title: '¿Eliminar categoría?',
      text: "Asegúrate de que no tenga productos asociados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Asumiendo que tienes un endpoint deleteCategory en tu API
        // Si no lo tienes, avísame para crearlo.
        this.api.deleteCategory(id).subscribe({
            next: () => {
                this.loadCategories();
                Swal.fire('Eliminado', 'La categoría ha sido eliminada.', 'success');
            },
            error: () => Swal.fire('Error', 'No se pudo eliminar.', 'error')
        });
      }
    });
  }
}