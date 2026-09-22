import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiService } from '../services/api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token del almacenamiento local
  const token = localStorage.getItem('token'); // O 'access_token', revisa cómo lo guardaste al hacer login
  const api = inject(ApiService);

  // 2. Si existe el token, clonar la petición y añadir el header
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Formato estándar: Bearer <token>
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si la petición llevaba token y el backend responde que no es válido/expiró
      // (401 en cualquier caso, o el 400 específico que manda authMiddleware al
      // vencer el JWT), cerramos la sesión localmente y mandamos a login en vez
      // de dejar que la petición falle en silencio.
      const tokenExpiredMessage = error.error?.message === 'Token inválido o expirado';
      const isSessionExpired = !!token && (error.status === 401 || (error.status === 400 && tokenExpiredMessage));

      if (isSessionExpired) {
        api.handleSessionExpired();
      }

      return throwError(() => error);
    })
  );
};
