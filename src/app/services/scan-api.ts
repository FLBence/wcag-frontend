import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, takeWhile, timer } from 'rxjs';
import { ScanStatus } from '../models/scan-status';
import { ScanResponseDto } from '../models/scan-response-dto';
import { ScanResultResponseDto } from '../models/scan-result-response-dto';
import { CreateScanRequestDto } from '../models/create-scan-request-dto';
import { AiSuggestionDto } from '../models/ai-suggestion-dto';

/*
 * A WCAG vizsgálatokhoz kapcsolódó HTTP kérések kezelése.
 *
 * Felelős a vizsgálatok létrehozásáért, elindításáért, állapotuk és eredményeik lekérdezéséért, valamint
 * az egyes hibákhoz tartozó AI alapú javítási javaslatok eléréséért.
 */
@Injectable({
  providedIn: 'root',
})
export class ScanApiService {
  private httpClient = inject(HttpClient);
  private baseUrl =
    (window.location.hostname === 'localhost'
      ? 'http://localhost:8080/api'
      : 'https://wcag-backend-d8jq.onrender.com/api') + '/scans';

  /*
   * Új WCAG vizsgálat létrehozásának kezdeményezése a backend felé.
   *
   * Továbbítja a vizsgálat létrehozásához szükséges adatokat, majd visszaadja a létrehozott vizsgálat adatait.
   */
  createScan(createScanRequestDto: CreateScanRequestDto): Observable<ScanResponseDto> {
    return this.httpClient.post<ScanResponseDto>(this.baseUrl, createScanRequestDto);
  }

  /*
   * A megadott WCAG vizsgálat elindításának kérése a backend felé.
   */
  startScan(scanId: number): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/${scanId}/start`, {}, { responseType: 'text' });
  }

  /*
   * A megadott WCAG vizsgálat aktuális állapotának lekérdezése.
   */
  getScanStatus(scanId: number): Observable<ScanResponseDto> {
    return this.httpClient.get<ScanResponseDto>(`${this.baseUrl}/${scanId}`);
  }

  /*
   * A megadott WCAG vizsgálat során feltárt hibák lekérdezése.
   */
  getScanResults(scanId: number): Observable<ScanResultResponseDto[]> {
    return this.httpClient.get<ScanResultResponseDto[]>(`${this.baseUrl}/${scanId}/results`);
  }

  /*
   * A WCAG-vizsgálat állapotának rendszeres lekérdezése.
   *
   * Másodpercenként lekéri a vizsgálat aktuális állapotát,
   * és addig folytatja az ellenőrzést, amíg a vizsgálat PENDING vagy IN_PROGRESS állapotban van.
   * A befejező állapotot még továbbítja, majd lezárja a folyamatot.
   *
   * Felhasznált forrás: https://www.learnrxjs.io/learn-rxjs/operators/filtering/takewhile
   */
  currentScanStatus(scanId: number): Observable<ScanResponseDto> {
    return timer(0, 1000).pipe(
      switchMap(() => this.getScanStatus(scanId)),
      takeWhile(
        (scan) => scan.status === ScanStatus.PENDING || scan.status === ScanStatus.IN_PROGRESS,
        true,
      ),
    );
  }

  /*
   * A megadott vizsgálati eredményhez tartozó AI alapú javítási javaslat lekérdezése.
   */
  getSuggestion(scanId: number, scanResultId: number): Observable<AiSuggestionDto> {
    return this.httpClient.get<AiSuggestionDto>(
      `${this.baseUrl}/${scanId}/results/${scanResultId}/suggestion`,
    );
  }
}
