import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  categories: any[] = [];
  showForm = false;
  catForm: FormGroup;
  editingId: number | null = null;

  // Imagen de la categoría
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
    this.catForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.cdr.detectChanges();
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.catForm.reset();
    this.selectedFile = null;
    this.imagePreview = null;
    this.editingId = null;
  }

  startEdit(cat: any) {
    this.editingId = cat.id;
    this.showForm = true;
    this.selectedFile = null;
    this.imagePreview = cat.image_url || null;
    this.catForm.patchValue({ name: cat.name });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => { this.imagePreview = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.catForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.catForm.get('name')?.value);
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.editingId) {
      this.api.updateCategory(this.editingId, formData).subscribe({
        next: () => {
          Swal.fire({
              title: '¡Éxito!',
              text: 'Categoría actualizada correctamente',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
          });
          this.loadCategories();
          this.toggleForm();
        },
        error: () => Swal.fire('Error', 'No se pudo actualizar la categoría', 'error')
      });
      return;
    }

    this.api.createCategory(formData).subscribe({
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