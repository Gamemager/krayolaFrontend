import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ajusta la URL si sigue siendo esa o local
  private apiUrl = 'https://krayolabackend-production.up.railway.app/api'; 
  
  // Inyección moderna
  private http = inject(HttpClient);
  private router = inject(Router);

  // --- ESTADO REACTIVO (Signals) ---

  currentUser = signal<any>(this.getUserFromStorage());
  
  isAuthenticated = computed(() => {
    const user = this.currentUser();
    return user !== null && user !== undefined;
  });
  
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {}

  // --- AUTH (Login Mejorado) ---
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        // Al recibir respuesta exitosa, guardamos todo
        if (response.token && response.user) {
          this.saveSession(response.token, response.user);
        }
      })
    );
  }

  // REGISTRO
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/register`, userData); 
  }

  // --- LOGOUT ---
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    this.currentUser.set(null); 
    
    this.router.navigate(['/']).then(() => {
      window.location.reload(); 
    });
  }

  // --------------------------------------------------------------------------------
  // PRODUCTOS
  // --------------------------------------------------------------------------------
  
  // Listar todos (Público)
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }
  
  // Ver uno (Público)
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`);
  }

  // Crear (Admin - Soporta JSON y FormData)
  createProduct(product: any | FormData): Observable<any> {
    const isFormData = product instanceof FormData;
    return this.http.post<any>(`${this.apiUrl}/products`, product, { 
      headers: this.getAuthHeaders(isFormData) 
    });
  }

  // Actualizar (Admin - Soporta JSON y FormData)
  updateProduct(id: number, product: any | FormData): Observable<any> {
    const isFormData = product instanceof FormData;
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, product, { 
      headers: this.getAuthHeaders(isFormData) 
    });
  }

  // Eliminar (Admin)
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`, { headers: this.getAuthHeaders() });
  }

  // --------------------------------------------------------------------------------
  // CATEGORÍAS (CRUD COMPLETO)
  // --------------------------------------------------------------------------------
  
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/categories/${id}`);
  }

  createCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/categories`, category, { headers: this.getAuthHeaders() });
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/categories/${id}`, category, { headers: this.getAuthHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/categories/${id}`, { headers: this.getAuthHeaders() });
  }

  // --------------------------------------------------------------------------------
  // USUARIOS (Gestión Admin)
  // --------------------------------------------------------------------------------
  
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/dashboard`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${id}/role`, { role }, { headers: this.getAuthHeaders() });
  }

  // --------------------------------------------------------------------------------
  // PEDIDOS / VENTAS (NUEVO)
  // --------------------------------------------------------------------------------

  // Crear Orden (Público o Privado - El token lo maneja el interceptor si existe)
  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders`, orderData);
  }

  // Historial Admin (Todas las ventas)
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`, { headers: this.getAuthHeaders() });
  }

  // Historial Cliente (Mis compras)
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/my-orders`, { headers: this.getAuthHeaders() });
  }

  // Estadísticas de Ventas (Para el Dashboard)
  getOrderStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/stats`, { headers: this.getAuthHeaders() });
  }

  // --------------------------------------------------------------------------------
  // HELPERS PRIVADOS
  // --------------------------------------------------------------------------------
  
  // Genera headers. Si es FormData, NO ponemos Content-Type.
  private getAuthHeaders(isFormData: boolean = false): HttpHeaders {
    const token = localStorage.getItem('token');
    // Creamos headers base con Authorization si hay token
    let headers = new HttpHeaders();
    if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    // No necesitamos setear Content-Type application/json manualmente, Angular lo hace.
    return headers;
  }

  private saveSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
  }

  private getUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
