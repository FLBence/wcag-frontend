import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScanResponseDto } from '../models/scan-response-dto';
@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/users';

  getMyScans(userId: number): Observable<ScanResponseDto[]> {
    return this.httpClient.get<ScanResponseDto[]>(`${this.baseUrl}/${userId}/myscans`);
  }
}
