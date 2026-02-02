import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token del almacenamiento local
  const token = localStorage.getItem('token'); // O 'access_token', revisa cómo lo guardaste al hacer login

  // 2. Si existe el token, clonar la petición y añadir el header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Formato estándar: Bearer <token>
      }
    });
    return next(authReq);
  }

  // 3. Si no hay token, pasar la petición tal cual
  return next(req);
};
