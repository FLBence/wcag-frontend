import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme-service';

@Component({
  imports: [CommonModule, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('wcag-frontend');
  private themeService = inject(ThemeService);

  selectedScanId: number | null = null;

  onScanStarted(scanId: number) {
    this.selectedScanId = scanId;
    console.log('Új szkennelés indult, generált Scan ID:', scanId);
  }

  get isDarkMode() {
    return this.themeService.isDarkMode;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
