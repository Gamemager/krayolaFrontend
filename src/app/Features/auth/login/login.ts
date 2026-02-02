import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

this.api.login(this.loginForm.value).subscribe({
  next: (res: any) => { // 1. Recibe la respuesta (asegúrate que tu backend devuelva el token aquí)
    this.isLoading = false;
    
    // 2. GUARDA EL TOKEN
    if (res.token) {
      localStorage.setItem('token', res.token); 
    }
    
    this.router.navigate(['/']); 
  },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.errorMessage = 'Credenciales incorrectas. Intenta de nuevo.';
      }
    });
  }
}
