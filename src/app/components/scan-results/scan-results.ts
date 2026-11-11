import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ScanApiService } from '../../services/scan-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ScanResultResponseDto } from '../../models/scan-result-response-dto';
import { ErrorLevel } from '../../models/error-level';
import { NgClass } from '@angular/common';
import { AiSuggestionDto } from '../../models/ai-suggestion-dto';
import { finalize } from 'rxjs';

@Component({
  imports: [NgClass],
  selector: 'app-scan-results',
  styleUrl: './scan-results.css',
  templateUrl: './scan-results.html',
})
export class ScanResults implements OnInit {
  private scanApiService = inject(ScanApiService);
  private changeDetectionRef = inject(ChangeDetectorRef);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  protected allScanResults: ScanResultResponseDto[] = [];

  protected scanResult: ScanResultResponseDto[] = [];
  private pageSize = 15;

  protected isLoading = true;
  protected errorMessage = '';
  private expandedRowIds = new Set<number>();
  protected loadingSuggestionId = signal<number | null>(null);
  protected suggestion = signal<AiSuggestionDto | null>(null);
  protected suggestionError = signal<string | null>(null);

  ngOnInit(): void {
    const scanId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (scanId) this.getScanResultData(scanId);
    else {
      this.isLoading = false;
      this.errorMessage = 'Hiba történt az adatok lekérése közben!';
    }
  }

  getScanResultData(scanId: number): void {
    this.scanApiService.getScanResults(scanId).subscribe({
      next: (data) => {
        this.allScanResults = data || [];
        this.scanResult = this.allScanResults.slice(0, this.pageSize);
        this.isLoading = false;
        this.changeDetectionRef.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Hiba történt az eredmények lekérdezése közben!';
        console.error(err);
        this.changeDetectionRef.detectChanges();
      },
    });
  }

  onTableScroll(event: any): void {
    const element = event.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 20;

    if (isAtBottom && this.scanResult.length < this.allScanResults.length) {
      const nextBatchSize = this.scanResult.length + this.pageSize;
      this.scanResult = this.allScanResults.slice(0, nextBatchSize);
      this.changeDetectionRef.detectChanges();
    }
  }

  get totalViolations(): number {
    return this.allScanResults.length;
  }

  getCountByLevel(level: ErrorLevel): number {
    return this.allScanResults.filter(
      (item) => item.errorLevel?.toUpperCase() === level.toUpperCase(),
    ).length;
  }

  getPercentage(level: ErrorLevel): number {
    const total = this.totalViolations;
    if (total === 0) return 0;
    return Math.round((this.getCountByLevel(level) / total) * 100);
  }

  getSeverityBadgeClass(level: ErrorLevel): string {
    switch (level?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'SERIOUS':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'MINOR':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  toggleRow(id: number): void {
    if (this.expandedRowIds.has(id)) this.expandedRowIds.delete(id);
    else this.expandedRowIds.add(id);
  }

  isExpanded(id: number): boolean {
    return this.expandedRowIds.has(id);
  }

  getSuggestion(item: ScanResultResponseDto): void {
    this.loadingSuggestionId.set(item.id);
    this.suggestionError.set(null);
    const scanId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.scanApiService
      .getSuggestion(scanId, item.id)
      .pipe(finalize(() => this.loadingSuggestionId.set(null)))
      .subscribe({
        next: (suggestion) => {
          item.aiSuggestion = suggestion;
          this.suggestion.set(suggestion);
        },
        error: (err) => {
          this.suggestionError.set(
            err.status === 502
              ? 'Az AI javaslat jelenleg nem elérhető.'
              : 'Hiba történt a javaslat lekérésekor.',
          );
        },
      });
  }

  openSuggestion(item: ScanResultResponseDto): void {
    if (item.aiSuggestion) {
      this.suggestion.set(item.aiSuggestion);
    }
  }

  closeSuggestion(): void {
    this.suggestion.set(null);
    this.suggestionError.set(null);
  }

  protected goToMain(): void {
    this.router.navigate(['']);
  }
}
