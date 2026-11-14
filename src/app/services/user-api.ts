import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScanResponseDto } from '../models/scan-response-dto';

/*
 * A felhasználókhoz kapcsolódó API-kérések kezelése.
 *
 * Lehetőséget biztosít a bejelentkezett felhasználó korábbi WCAG vizsgálatainak lekérdezésére.
 */
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private httpClient = inject(HttpClient);
  private baseUrl =
    (window.location.hostname === 'localhost'
      ? 'http://localhost:8080/api'
      : 'https://wcag-backend-d8jq.onrender.com/api') + '/auth';

  /*
   * A bejelentkezett felhasználó korábbi WCAG vizsgálatainak lekérdezése.
   */
  getMyScans(): Observable<ScanResponseDto[]> {
    return this.httpClient.get<ScanResponseDto[]>(`${this.baseUrl}/myscans`);
  }
}
