import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme-service';
import { Navbar } from './components/navbar/navbar';

/*
 * Az alkalmazás gyökérkomponense.
 *
 * Betölti a navigációs sávot és az aktuális útvonalhoz tartozó tartalmat, valamint biztosítja a megjelenítési
 *  téma állapotának elérését és módosítását.
 */
@Component({
  imports: [CommonModule, RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('wcag-frontend');
  private themeService = inject(ThemeService);

  /*
   * Az alkalmazás aktuális témabeállításának lekérdezése a ThemeService segítségével.
   */
  get isDarkMode() {
    return this.themeService.isDarkMode;
  }

  /*
   * Az alkalmazás megjelenítési témájának váltása.
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
