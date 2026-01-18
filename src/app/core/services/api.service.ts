import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://krayolabackend-production.up.railway.app/api'; // URL de tu backend

  constructor(private http: HttpClient) { }

  // --- CATEGORÍAS ---
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  // --- PRODUCTOS ---
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }
  
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  // --- AUTH (Login) ---
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // --- USUARIOS (Registro) ---
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }
}
