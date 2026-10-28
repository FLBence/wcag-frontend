import { Component, inject, PLATFORM_ID } from '@angular/core';
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

  protected isMenuOpen = false;

  get isLoggedIn(): boolean {
    if(isPlatformBrowser(this.platformId)){
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  get username(): string {
    if(isPlatformBrowser(this.platformId)){
      return localStorage.getItem('username') || 'Felhasználó';
    }
    return 'Felhasználó';
  }

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  protected goToSettings(): void {
    this.isMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  protected goToMyScans(): void {
    this.isMenuOpen = false;
    this.router.navigate(['/myscans']);
  }

  protected logout(): void {
    this.isMenuOpen = false;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    this.router.navigate(['']);
  }
}