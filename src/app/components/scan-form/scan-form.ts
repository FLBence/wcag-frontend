import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanApiService } from '../../services/scan-api';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-scan-form',
  styleUrl: './scan-form.css',
  templateUrl: './scan-form.html',
})
export class ScanForm {
  private scanApiService = inject(ScanApiService);
  
  websiteUrl = '';
  isLoading = false;
  errorMessage = '';
  
  @Output() scanStarted = new EventEmitter<number>();

  onStartScan() {
    let url = this.websiteUrl.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`; // ToDo Címek ellenőrzése (hibás esetén ne legyen http 500)
   }

    this.isLoading = true;
    this.errorMessage = '';

    this.scanApiService.createScan(url).subscribe({
      next: (createdScan) => {
        this.scanApiService.startScan(createdScan.id).subscribe({
          next: () => {
            this.isLoading = false;
            this.scanStarted.emit(createdScan.id);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Hiba történt a szkennelés elindításakor!';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Hiba történt az adatbázisba való mentés közben!';
        console.error(err);
      }
    })
  }
}
