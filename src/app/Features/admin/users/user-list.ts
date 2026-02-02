import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private http = inject(HttpClient);
  // URL Correcta (Asegúrate de que esta sea la de producción o desarrollo según corresponda)
  private apiUrl = 'https://krayolabackend-production.up.railway.app/api/users'; 
  
  users = signal<any[]>([]);

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log('Usuarios cargados:', data);
        this.users.set(data);
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        // Opcional: Mostrar alerta si falla la carga inicial
        // Swal.fire('Error', 'No se pudieron cargar los usuarios. Revisa tu conexión.', 'error');
      }
    });
  }

  toggleRole(user: any) {
    const newRole = user.role === 'admin' ? 'client' : 'admin';
    const actionText = user.role === 'admin' ? 'quitar permisos de administrador' : 'dar permisos de administrador';
    
    Swal.fire({
      title: `¿Cambiar rol a ${newRole === 'admin' ? 'Administrador' : 'Cliente'}?`,
      text: `Estás a punto de ${actionText} a ${user.name}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff6600', // Naranja Krayola
      cancelButtonColor: '#6c757d',
      // Estilo SweetAlert Light
      background: '#fff',
      color: '#333'
    }).then((result) => {
      if (result.isConfirmed) {
        
        // NOTA: Asegúrate de que tu backend espera {_id: ...} o usa el ID en la URL
        const userId = user._id || user.id; // Soporte para ambos formatos de ID
        
        this.http.put(`${this.apiUrl}/${userId}/role`, { role: newRole }).subscribe({
          next: () => {
            // Actualizar localmente la señal sin recargar todo
            this.users.update(currentUsers => 
              currentUsers.map(u => u === user ? { ...u, role: newRole } : u)
            );
            
            Swal.fire({
              title: '¡Actualizado!',
              text: `El rol ha sido cambiado exitosamente.`,
              icon: 'success',
              confirmButtonColor: '#ff6600'
            });
          },
          error: (err) => {
            console.error(err);
            Swal.fire({
              title: 'Error', 
              text: 'No se pudo cambiar el rol. Verifica tus permisos.', 
              icon: 'error',
              confirmButtonColor: '#ff6600'
            });
          }
        });
      }
    });
  }
}
