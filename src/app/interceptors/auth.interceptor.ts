import { HttpInterceptorFn } from '@angular/common/http';

/*
 * HTTP-kérések hitelesítési fejlécének kezelése.
 *
 * Ellenőrzi, hogy található-e JWT token a localStorage-ban.
 * Ha igen, a token hozzáadásával módosítja a kimenő HTTP-kérés Authorization fejlécét Bearer hitelesítési formátumban.
 *
 * Felhasznált forrás: https://angular.dev/api/common/http/HttpInterceptorFn
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const rawToken = localStorage.getItem('token');
  const token = rawToken ? rawToken.trim() : null;

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
