import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { UserApiService } from '../../services/user-api';
import { ScanResponseDto } from '../../models/scan-response-dto';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

/*
 * A bejelentkezett felhasználó korábbi WCAG vizsgálatainak kezelése.
 *
 * A komponens lekéri és megjeleníti a felhasználó vizsgálatait, valamint lehetőséget biztosít az egyes weboldalak vizsgálati eredményeinek
 * megnyitására és a főoldalra történő navigációra.
 */
@Component({
  imports: [CommonModule],
  selector: 'app-my-scans',
  styleUrl: './my-scans.css',
  templateUrl: './my-scans.html',
})
export class MyScans implements OnInit {
  private userApiService = inject(UserApiService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  protected myScans: ScanResponseDto[] = [];
  protected isLoading = signal(true);

  /*
   * A komponens inicializálásakor elindítja a felhasználó korábbi vizsgálatainak lekérdezését,
   * amennyiben az alkalmazás böngészőkörnyezetben fut.
   *
   * Mesterséges intelligencia által javasolt módosítás.
   */
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getMyScans();
    }
  }

  /*
   * A bejelentkezett felhasználó korábbi WCAG-vizsgálatainak lekérése.
   *
   * Sikeres válasz esetén eltárolja a kapott vizsgálati adatokat, majd lezárja a betöltési folyamatot.
   */
  protected getMyScans(): void {
    this.userApiService
      .getMyScans()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          this.myScans = data;
        },
        error: (err) => {
          console.error('Hiba a vizsgálatok lekérdezésekor:', err);
        },
      });
  }

  /*
   * Navigáció a megadott WCAG-vizsgálat eredményoldalára.
   */
  protected redirectToResults(scanId: number): void {
    this.router.navigate([`/${scanId}/results`]);
  }

  /*
   * Navigáció a főoldalra.
   */
  protected goToMain(): void {
    this.router.navigate(['/']);
  }
}
