import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-client-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-orders.html',
  styleUrl: './client-orders.scss'
})
export class ClientOrdersComponent implements OnInit {
  private api = inject(ApiService);
  
  myOrders = signal<any[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.api.getMyOrders().subscribe({
      next: (data) => {
        this.myOrders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando mis compras:', err);
        this.isLoading.set(false);
      }
    });
  }
}
