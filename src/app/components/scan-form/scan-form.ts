import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
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
  private changeDetectionRef = inject(ChangeDetectorRef);
  
  websiteUrl = '';
  isLoading = false;
  errorMessage = '';
  
  @Output() scanStarted = new EventEmitter<number>();

  onStartScan(event?: Event) {
      if(event) {
        event.preventDefault();
      }

      let url = this.websiteUrl.trim();
      if (!url) return;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      this.isLoading = true;
      this.errorMessage = '';

      this.scanApiService.createScan(url).subscribe({
        next: (createdScan) => {
          this.scanApiService.startScan(createdScan.id).subscribe({
            next: () => {
              this.isLoading = false;
              this.scanStarted.emit(createdScan.id);
              this.changeDetectionRef.detectChanges();
            },
            error: (err) => {
            this.isLoading = false;
            this.errorMessage = err.error?.message || 'Hiba történt a szkennelés elindításakor!';
            this.changeDetectionRef.detectChanges();
            } 
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'A megadott URL érvénytelen vagy nem menthető!';
          this.changeDetectionRef.detectChanges();
        }
      });
    }
}
