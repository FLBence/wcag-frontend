// src/app/guards/auth.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, CanActivateFn } from '@angular/router';

/*
 * Útvonal-hozzáférést ellenőrző guard.
 *
 * Ellenőrzi, hogy a felhasználó rendelkezik-e eltárolt hitelesítési tokennel.
 * Bejelentkezés hiányában a bejelentkezési oldalra irányítja, az eredetileg megnyitni kívánt útvonal továbbításával.
 *
 * Felhasznált forrás: https://angular.dev/guide/routing/route-guards
 *
 * A forrás alapján készült megoldás a projekt követelményeihez mesterséges intelligencia közreműködéssével került átdolgozásra.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
