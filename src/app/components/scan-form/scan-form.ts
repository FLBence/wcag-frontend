import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanApiService } from '../../services/scan-api';
import { ScanStatus } from '../../models/scan-status';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CreateScanRequestDto } from '../../models/create-scan-request-dto';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-scan-form',
  styleUrl: './scan-form.css',
  templateUrl: './scan-form.html',
})
export class ScanForm {
  private scanApiService = inject(ScanApiService);
  private changeDetectionRef = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);


  protected isAuthWindowOpen = signal<boolean>(false);

  private websiteUrl = '';
  private isLoading = false;
  private errorMessage = '';

  
  @Output() scanStarted = new EventEmitter<number>();

  protected onStartScan() {
      if(!this.authService.isLoggedIn()){
        this.isAuthWindowOpen.set(true);
        return;
      }

      let url = this.websiteUrl.trim();
      if (!url) return;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }

      this.isLoading = true;
      this.errorMessage = '';

      const createScanRequestDto: CreateScanRequestDto = {
        websiteUrl: url,
        id: Number(localStorage.getItem('userId'))
      };

      this.scanApiService.createScan(createScanRequestDto).subscribe({
        next: (createdScan) => {
          this.scanApiService.startScan(createdScan.id).subscribe({
            next: () => {
              this.scanStarted.emit(createdScan.id);

              this.scanApiService.currentScanStatus(createdScan.id).subscribe({
                next: (scan) => {
                  if(scan.status === ScanStatus.COMPLETED){
                    this.isLoading = false;
                    this.changeDetectionRef.detectChanges();
                    this.router.navigate([`/${createdScan.id}/results`]);
                  }
                  else if(scan.status === ScanStatus.ABORTED){
                    this.isLoading = false;
                    this.errorMessage = "Hiba történt a szkennelés közben, próbálja újra később!";
                    this.changeDetectionRef.detectChanges();
                  }
                },
                error: (err) => {
                  this.isLoading = false;
                  this.errorMessage = "Hiba történt a szkennelés állapotának lekérdezése közben";
                  this.changeDetectionRef.detectChanges();
                }
              });
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
          this.errorMessage = err.error?.message || 'A megadott URL nem létezik vagy jelenleg nem elérhető.';
          this.changeDetectionRef.detectChanges();
        }
      });
    }

    protected redirectToLogin(): void {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url}
      });
    }

    protected redirectToRegister(): void {
      this.router.navigate(['/auth/register'], {
        queryParams: { returnUrl: this.router.url}
      });
    }
}
