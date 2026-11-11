import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../services/theme-service';
import { isPlatformBrowser } from '@angular/common';

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

  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  get username(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username') || 'Felhasználó';
    }
    return 'Felhasználó';
  }

  protected toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected goToSettings(): void {
    this.isMenuOpen.set(false);
    this.router.navigate(['/settings']);
  }

  protected goToMyScans(): void {
    this.isMenuOpen.set(false);
    this.router.navigate([`/users/${localStorage.getItem('userId')}/myscans`]);
  }
  protected goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
  protected goToMain(): void {
    this.router.navigate(['']);
  }

  protected logout(): void {
    this.isMenuOpen.set(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
