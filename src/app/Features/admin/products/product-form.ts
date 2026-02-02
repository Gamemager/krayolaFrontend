import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], 
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {
  
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: any[] = [];
  
  // Imagen
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category_id: ['', Validators.required],
      image_url: [''],
      // Inicializamos el array de especificaciones vacío
      specifications: this.fb.array([]) 
    });
  }

  // Getter fácil para usar en el HTML
  get specs() {
    return this.productForm.get('specifications') as FormArray;
  }

  ngOnInit(): void {
    this.loadCategories();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id;
        this.loadProductData(this.productId);
      }
    });
  }

  // --- MÉTODOS PARA ESPECIFICACIONES ---
  
  addSpec() {
    const specGroup = this.fb.group({
      key: ['', Validators.required],   // Ej: "Material"
      value: ['', Validators.required]  // Ej: "Acero"
    });
    this.specs.push(specGroup);
  }

  removeSpec(index: number) {
    this.specs.removeAt(index);
  }

  // --- CARGA DE DATOS ---

  loadCategories() {
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  loadProductData(id: number) {
    this.api.getProductById(id).subscribe({
      next: (product) => {
        // Cargar campos simples
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category_id: product.category_id,
          image_url: product.image_url
        });

        if (product.image_url) {
          this.imagePreview = product.image_url;
        }

        // Cargar Especificaciones Dinámicas
        if (product.specifications) {
          // Limpiar array actual por si acaso
          this.specs.clear();

          // Parsear si es string (algunas BD devuelven string, otras objeto directo)
          const specsObj = typeof product.specifications === 'string' 
                           ? JSON.parse(product.specifications) 
                           : product.specifications;

          // Convertir Objeto {key:val} -> FormArray [{key, val}]
          if (specsObj) {
            Object.keys(specsObj).forEach(key => {
              this.specs.push(this.fb.group({
                key: [key, Validators.required],
                value: [specsObj[key], Validators.required]
              }));
            });
          }
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar el producto', 'error');
        this.router.navigate(['/admin/productos']);
      }
    });
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

  // --- GUARDADO ---

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('stock', this.productForm.get('stock')?.value);
    formData.append('category_id', this.productForm.get('category_id')?.value);
    
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } 

    // CONVERTIR SPECS ARRAY -> OBJETO JSON
    const specsArray = this.productForm.value.specifications;
    const specsObject: any = {};
    
    // Convertir [{key:'Marca', value:'X'}] a {'Marca':'X'}
    specsArray.forEach((item: any) => {
      if (item.key && item.value) {
        specsObject[item.key] = item.value;
      }
    });

    // Añadir al FormData como string JSON
    formData.append('specifications', JSON.stringify(specsObject));

    // Enviar a API
    if (this.isEditMode && this.productId) {
      this.api.updateProduct(this.productId, formData).subscribe({
        next: () => {
          Swal.fire('Actualizado', 'Producto actualizado', 'success');
          this.router.navigate(['/admin/productos']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
      });
    } else {
      this.api.createProduct(formData).subscribe({
        next: () => {
          Swal.fire('Creado', 'Producto creado', 'success');
          this.router.navigate(['/admin/productos']);
        },
        error: (err) => {
          console.error(err);
          Swal.fire('Error', 'No se pudo crear', 'error');
        }
      });
    }
  }
}
