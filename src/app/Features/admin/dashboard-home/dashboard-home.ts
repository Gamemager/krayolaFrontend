import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss',
})
export class DashboardHome implements OnInit {
  private api = inject(ApiService);

  stats = signal({
    productosTotal: 0,
    productosActivos: 0,
    productosInhabilitados: 0,
    usuariosTotal: 0,
    usuariosAdmin: 0,
    ventasTotal: 0
  });

  isLoading = signal(true);

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Una sola consulta liviana en vez de 3 peticiones en paralelo
    // (productos + usuarios + ventas), para reducir el riesgo de que
    // el backend se quede corto cuando la base de datos "despierta".
    this.api.getDashboardStats().subscribe({
      next: (res: any) => {
        this.stats.set({
          productosTotal: res.productosTotal ?? 0,
          productosActivos: res.productosActivos ?? 0,
          productosInhabilitados: res.productosInhabilitados ?? 0,
          usuariosTotal: res.usuariosTotal ?? 0,
          usuariosAdmin: res.usuariosAdmin ?? 0,
          ventasTotal: res.ventasTotal ?? 0
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
