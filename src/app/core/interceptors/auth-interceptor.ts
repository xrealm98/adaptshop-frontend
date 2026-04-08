import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Buscamos el token de autentificación en el localStorage
  const token = localStorage.getItem('token');
  // Si lo encuentra, se clona la petición y se le añade en el header el token.
  if (token) {
    const authRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return next(authRequest);
  }
  // Si no existe el token, se deja la petición sin modificar.
  return next(req);
};
