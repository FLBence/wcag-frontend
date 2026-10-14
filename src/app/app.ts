import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [CommonModule, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('wcag-frontend');

  selectedScanId: number | null = null;

  onScanStarted(scanId: number) {
    this.selectedScanId = scanId;
    console.log('Új szkennelés indult, generált Scan ID:', scanId);
  }
}
