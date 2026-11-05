import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { UserApiService } from '../../services/user-api';
import { ScanResponseDto } from '../../models/scan-response-dto';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  protected myScans: ScanResponseDto[] | null = null;
  protected isLoading = signal(true);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getMyScans();
    }
  }

  protected getMyScans(): void {
    this.userApiService.getMyScans().subscribe({
      next: (data) => {
        this.myScans = data;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Hiba a scanek lekérdezésekor:', err);
        this.isLoading.set(false);
      },
    });
  }

  protected redirectToResults(scanId: number): void {
    this.router.navigate([`/${scanId}/results`]);
  }

  protected goToMain(): void {
    this.router.navigate(['/']);
  }
}
