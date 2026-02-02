import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.scss'
})
export class SalesListComponent implements OnInit {
  private api = inject(ApiService);
  
  orders = signal<any[]>([]);
  isLoading = signal(true);
  totalRevenue = signal(0);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.api.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        // Calcular total recaudado sumando el 'total_amount' de todas las órdenes
        const total = data.reduce((acc, order) => acc + parseFloat(order.total_amount), 0);
        this.totalRevenue.set(total);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando ventas:', err);
        this.isLoading.set(false);
      }
    });
  }
}
