import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanApiService } from '../../services/scan-api';
import { ScanStatus } from '../../models/scan-status';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CreateScanRequestDto } from '../../models/create-scan-request-dto';

/*
 * A weboldalak WCAG vizsgálatának elindításához szükséges felhasználói műveletek kezelése.
 *
 * A komponens fogadja és ellenőrzi a vizsgálandó weboldal URL-jét, kezeli a vizsgálat létrehozását és elindítását, valamint
 * megjeleníti a folyamat állapotával kapcsolatos visszajelzéseket.
 *
 * Bejelentkezés hiányában lehetőséget biztosít a felhasználó számára a bejelentkezési vagy regisztrációs oldal elérésére.
 */
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

  protected isAuthWindowOpen = signal(false);

  private websiteUrl = signal('');
  private isLoading = signal(false);
  private errorMessage = signal('');
  /*
   * A megadott weboldal WCAG vizsgálatának elindítása.
   *
   * Ellenőrzi a felhasználó bejelentkezési állapotát és a megadott URL-t, majd létrehozza és elindítja a vizsgálatot.
   * Ezt követően lekéri annak állapotát, és kezeli a sikeres befejezést vagy az esetlegesen fellépő hibákat.
   *
   * A metódus mesterséges intelligenciával került módosításra.
   */
  protected onStartScan() {
    if (!this.authService.isLoggedIn()) {
      this.isAuthWindowOpen.set(true);
      return;
    }

    let url = this.websiteUrl().trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const createScanRequestDto: CreateScanRequestDto = {
      websiteUrl: url,
      id: Number(localStorage.getItem('userId')),
    };

    this.scanApiService.createScan(createScanRequestDto).subscribe({
      next: (createdScan) => {
        this.scanApiService.startScan(createdScan.id).subscribe({
          next: () => {
            this.scanApiService.currentScanStatus(createdScan.id).subscribe({
              next: (scan) => {
                if (scan.status === ScanStatus.COMPLETED) {
                  this.isLoading.set(false);
                  this.changeDetectionRef.detectChanges();
                  this.router.navigate([`/${createdScan.id}/results`]);
                } else if (scan.status === ScanStatus.ABORTED) {
                  this.isLoading.set(false);
                  this.errorMessage.set('Hiba történt a szkennelés közben, próbálja újra később!');
                  this.changeDetectionRef.detectChanges();
                }
              },
              error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set('Hiba történt a szkennelés állapotának lekérdezése közben');
                this.changeDetectionRef.detectChanges();
              },
            });
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(err.error?.message || 'Hiba történt a szkennelés elindításakor!');
            this.changeDetectionRef.detectChanges();
          },
        });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'A megadott URL nem létezik vagy jelenleg nem elérhető.',
        );
        this.changeDetectionRef.detectChanges();
      },
    });
  }

  /*
   * Navigáció a bejelentkezési oldalra.
   *
   * A visszatérési útvonalat query paraméterként továbbítja, hogy a sikeres bejelentkezés után a felhasználó
   * visszatérhessen az eredeti oldalra.
   */
  protected redirectToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  /*
   * Navigáció a regisztrációs oldalra.
   *
   * A visszatérési útvonalat query paraméterként továbbítja, hogy a sikeres regisztrációt követően a felhasználó
   * visszatérhessen az eredeti oldalra.
   */
  protected redirectToRegister(): void {
    this.router.navigate(['/auth/register'], {
      queryParams: { returnUrl: this.router.url },
    });
  }
}
