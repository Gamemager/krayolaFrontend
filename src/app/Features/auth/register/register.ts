import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'] // Puedes reutilizar login.component.css si quieres
})
export class Register {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.api.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // Opcional: Auto-login tras registro o ir al login
        Swal.fire({
          title: '¡Bienvenido a Krayola!',
          text: 'Tu cuenta ha sido creada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Iniciar Sesión',
          confirmButtonColor: '#ff6600', // Tu color naranja
          background: '#1a1a1a', // Fondo oscuro
          color: '#ffffff', // Texto blanco
          backdrop: `rgba(0,0,0,0.8)` // Fondo oscuro detrás del modal
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/auth/login']);
          }
        });

      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        
        // También podemos mejorar el mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No pudimos crear tu cuenta. Verifica si el correo ya está registrado.',
          background: '#1a1a1a',
          color: '#fff',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}