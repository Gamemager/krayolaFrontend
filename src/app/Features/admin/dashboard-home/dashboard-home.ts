import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome implements OnInit {
private api = inject(ApiService); // Usamos ApiService que ya tiene headers

  stats = signal({
    productosTotal: 0,
    productosActivos: 0,
    usuariosTotal: 0,
    usuariosAdmin: 0,
    ventasTotal: 0 // Cambiamos nombre para ser claros
  });

  isLoading = signal(true);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Usamos los métodos del ApiService que ya tienen autenticación
    forkJoin({
      productos: this.api.getProducts(),
      usuarios: this.api.getUsers(),
      ventas: this.api.getOrders() // <--- Llamamos a las órdenes
    }).subscribe({
      next: (res) => {
        // Cálculos
        const productosActivos = res.productos.filter(p => p.stock > 0).length;
        const admins = res.usuarios.filter(u => u.role === 'admin').length;
        const totalVentas = res.ventas.length; // Contamos el array de ventas

        this.stats.set({
          productosTotal: res.productos.length,
          productosActivos: productosActivos,
          usuariosTotal: res.usuarios.length,
          usuariosAdmin: admins,
          ventasTotal: totalVentas // Asignamos la cantidad real
        });
        
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.isLoading.set(false);
      }
    });
  }
}
