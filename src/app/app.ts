import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ScanForm } from './components/scan-form/scan-form';

@Component({
  imports: [CommonModule, ScanForm],
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
