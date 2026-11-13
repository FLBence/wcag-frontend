import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ScanApiService } from '../../services/scan-api';
import { ActivatedRoute, Router } from '@angular/router';
import { ScanResultResponseDto } from '../../models/scan-result-response-dto';
import { ErrorLevel } from '../../models/error-level';
import { NgClass } from '@angular/common';
import { AiSuggestionDto } from '../../models/ai-suggestion-dto';
import { finalize } from 'rxjs';

/*
 * A WCAG vizsgálatok eredményeinek megjelenítése és kezelése.
 *
 * A komponens lekéri a vizsgálati eredményeket, kezeli azok megjelenítését és súlyosság szerinti összesítését, valamint
 * lehetőséget biztosít az egyes hibákhoz tartozó AI alapú javítási javaslatok lekérésére és megtekintésére.
 */
@Component({
  imports: [NgClass],
  selector: 'app-scan-results',
  styleUrl: './scan-results.css',
  templateUrl: './scan-results.html',
})
export class ScanResults implements OnInit {
  private scanApiService = inject(ScanApiService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  protected allScanResults: ScanResultResponseDto[] = [];
  protected scanResult: ScanResultResponseDto[] = [];

  private pageSize = signal(15);
  protected isLoading = signal(true);
  protected errorMessage = signal('');
  private expandedRowIds = new Set<number>();
  protected loadingSuggestionId = signal<number | null>(null);
  protected suggestion = signal<AiSuggestionDto | null>(null);
  protected suggestionError = signal<string | null>(null);

  /*
   * A komponens inicializálásakor kiolvassa a vizsgálat azonosítóját
   * az útvonal paraméterei közül, majd lekéri a hozzá tartozó vizsgálati eredményeket.
   */
  ngOnInit(): void {
    const scanId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (scanId) this.getScanResultData(scanId);
    else {
      this.isLoading.set(false);
      this.errorMessage.set('Hiba történt az adatok lekérése közben!');
    }
  }

  /*
   * A megadott WCAG-vizsgálat eredményeinek lekérése.
   *
   * Sikeres válasz esetén eltárolja az eredményeket, és előkészíti a kezdetben megjelenített elemeket.
   */
  getScanResultData(scanId: number): void {
    this.scanApiService.getScanResults(scanId).subscribe({
      next: (data) => {
        this.allScanResults = data || [];
        this.scanResult = this.allScanResults.slice(0, this.pageSize());
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Hiba történt az eredmények lekérdezése közben!');
        console.error(err);
      },
    });
  }

  /*
   * A vizsgálati eredményeket tartalmazó táblázat görgetésének kezelése.
   *
   * Ha a felhasználó a lista aljára ér, további eredményeket tölt be a már lekért adatok közül.
   *
   * A táblázat görgetéséhez kapcsolódó, saját elképzelés alapján mesterséges intelligencia közreműködésével megvalósított metódus.
   */
  onTableScroll(event: any): void {
    const element = event.target;
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 20;

    if (isAtBottom && this.scanResult.length < this.allScanResults.length) {
      const nextBatchSize = this.scanResult.length + this.pageSize();
      this.scanResult = this.allScanResults.slice(0, nextBatchSize);
    }
  }

  /*
   * Az adott szkennhez tartozó összes hiba számának meghatározása.
   */
  get totalViolations(): number {
    return this.allScanResults.length;
  }

  /*
   * Az adott súlyossági szinthez tartozó hibák számának meghatározása.
   * A getCountByLevel, getPercentage, getSeverityBadgeClass megvalósítása során saját elképzelés alapján,
   *  mesterséges intelligencia közreműködéssel továbbfejlesztett metódusok, az alkalmazás egységes dizájnjának megtartása érdekében.
   */
  getCountByLevel(level: ErrorLevel): number {
    return this.allScanResults.filter(
      (item) => item.errorLevel?.toUpperCase() === level.toUpperCase(),
    ).length;
  }

  /*
   * Az adott súlyossági szinthez tartozó hibák százalékos arányának
   * kiszámítása az összes vizsgálati eredményhez viszonyítva.
   */
  getPercentage(level: ErrorLevel): number {
    const total = this.totalViolations;
    if (total === 0) return 0;
    return Math.round((this.getCountByLevel(level) / total) * 100);
  }

  /*
   * A hiba súlyossági szintjéhez tartozó CSS-osztályok meghatározása.
   */
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

  /*
   * A megadott táblázatsor kinyitott állapotának váltása.
   */
  toggleRow(id: number): void {
    if (this.expandedRowIds.has(id)) this.expandedRowIds.delete(id);
    else this.expandedRowIds.add(id);
  }

  /*
   * Annak ellenőrzése, hogy a megadott táblázatsor ki van-e nyitva.
   */
  isExpanded(id: number): boolean {
    return this.expandedRowIds.has(id);
  }

  /*
   * A kiválasztott vizsgálati eredményhez tartozó MI-alapú
   * javítási javaslat lekérése.
   *
   * A metódus kezeli a betöltési állapotot, a kapott javaslatot
   * és az esetlegesen fellépő hibákat.
   */
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

  /*
   * A kiválasztott vizsgálati eredményhez már eltárolt
   * javítási javaslat megjelenítése.
   */
  openSuggestion(item: ScanResultResponseDto): void {
    if (item.aiSuggestion) {
      this.suggestion.set(item.aiSuggestion);
    }
  }

  /*
   * A javítási javaslatot megjelenítő ablak bezárása
   * és a kapcsolódó hibaüzenet törlése.
   */
  closeSuggestion(): void {
    this.suggestion.set(null);
    this.suggestionError.set(null);
  }

  /*
   * Navigáció a főoldalra.
   */
  protected goToMain(): void {
    this.router.navigate(['']);
  }
}
