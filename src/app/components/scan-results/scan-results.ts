import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ScanApiService } from '../../services/scan-api';
import { ActivatedRoute } from '@angular/router';
import { ScanResultResponseDto } from '../../models/scan-result-response-dto';
import { ErrorLevel } from '../../models/error-level';
import { NgClass } from '@angular/common';
@Component({
  imports: [NgClass],
  selector: 'app-scan-results',
  styleUrl: './scan-results.css',
  templateUrl: './scan-results.html',
})
export class ScanResults implements OnInit{
  private scanApiService = inject(ScanApiService);
  private changeDetectionRef = inject(ChangeDetectorRef);
  private activatedRoute = inject(ActivatedRoute);

  scanResult: ScanResultResponseDto[] | null = null;
  private isLoading = true;
  private errorMessage = '';
  private expandedRowIds = new Set<number>();

  ngOnInit(): void {
    const scanId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if(scanId)
      this.getScanResultData(scanId);
    
    else
    {
      this.isLoading = false;
      this.errorMessage = "Hiba történt az adatok lekérése közben!"
    }
  }

  getScanResultData(scanId: number): void{
    this.scanApiService.getScanResults(scanId).subscribe({
      next: (data) => {
        this.scanResult = data;
        this.isLoading = false;
        this.changeDetectionRef.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Hiba történt az eredmények lekérdezése közben!";
        this.changeDetectionRef.detectChanges();
      },
    })
  }

  get totalViolations(): number{
    return this.scanResult ? this.scanResult.length : 0;
  }

  getCountByLevel(level: ErrorLevel): number {
    if(!this.scanResult)
      return 0;
    return this.scanResult.filter(item => item.errorLevel?.toUpperCase() === level.toUpperCase()).length;
  }

  getPercentage(level: ErrorLevel): number {
    const total = this.totalViolations;
    if(total === 0)
      return 0;
    return Math.round((this.getCountByLevel(level) / total) * 100);
  }

  getSeverityBadgeClass(level: ErrorLevel): string {
    switch (level?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border border-red-200';
      case 'SERIOUS': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'MINOR': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  toggleRow(id: number): void {
    if(this.expandedRowIds.has(id))
      this.expandedRowIds.delete(id);
    else
      this.expandedRowIds.add(id);
  }

  isExpanded(id: number): boolean{
    return this.expandedRowIds.has(id);
  }
}
