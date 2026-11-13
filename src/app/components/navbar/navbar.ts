import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme-service';
import { isPlatformBrowser } from '@angular/common';

/*
 * A navigációs sáv működésének és a kapcsolódó felhasználói
 * műveleteknek a kezelése.
 *
 * A komponens kezeli a navigációs menüt, a téma váltását, a felhasználói adatokat, valamint a bejelentkezéshez,
 * kijelentkezéshez és a különböző oldalakhoz kapcsolódó navigációt.
 *
 * A platformId-vel kapcsolatos kódok/módosítások a mesterséges intelligencia javaslatára kerültek beépítésre.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);

  protected isMenuOpen = signal(false);

  /*
   * A bejelentkezési állapot lekérdezése a localStorage alapján.
   *
   * Böngészőkörnyezeten kívül false értéket ad vissza.
   */
  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  /*
   * A bejelentkezett felhasználó nevének lekérdezése a localStorage alapján.
   *
   * Ha nincs eltárolt felhasználónév, az alapértelmezett „Felhasználó” értéket adja vissza.
   */
  get username(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username') || 'Felhasználó';
    }
    return 'Felhasználó';
  }

  /*
   * A navigációs menü megnyitott állapotának váltása.
   */
  protected toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  /*
   * Az alkalmazás témájának váltása a ThemeService segítségével.
   */
  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /*
   * A navigációs menü bezárása és navigáció a felhasználó korábbi vizsgálataihoz.
   */
  protected goToMyScans(): void {
    this.isMenuOpen.set(false);
    this.router.navigate([`/users/${localStorage.getItem('userId')}/myscans`]);
  }

  /*
   * Navigáció a bejelentkezési oldalra.
   */
  protected goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /*
   * Navigáció a főoldalra.
   */
  protected goToMain(): void {
    this.router.navigate(['']);
  }

  /*
   * A felhasználó kijelentkeztetése.
   *
   * Bezárja a navigációs menüt, törli a localStorage-ban tárolt felhasználói és hitelesítési adatokat,
   * majd visszanavigál a főoldalra.
   */
  protected logout(): void {
    this.isMenuOpen.set(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
