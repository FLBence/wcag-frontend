import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, switchMap, takeWhile, timer } from "rxjs";
import { ScanStatus } from "../models/scan-status";
import { ScanResponseDto } from "../models/scan-response-dto";
import { ScanResultResponseDto } from "../models/scan-result-response-dto";

@Injectable({
    providedIn: 'root'
})
export class ScanApiService {
    private httpClient = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/scans';


    createScan(websiteUrl: string): Observable<ScanResponseDto> {
        return this.httpClient.post<ScanResponseDto>(this.baseUrl, {websiteUrl})
    }

    startScan(scanId: number): Observable<string> {
        return this.httpClient.post(`${this.baseUrl}/${scanId}/start`, {}, { responseType: 'text'});
    }

    getScanStatus(scanId: number): Observable<ScanResponseDto> {
        return this.httpClient.get<ScanResponseDto>(`${this.baseUrl}/${scanId}`);
    }

    getScanResults(scanId: number): Observable<ScanResultResponseDto[]> {
        return this.httpClient.get<ScanResultResponseDto[]>(`${this.baseUrl}/${scanId}/results`);
    }

    currentScanStatus(scanId: number): Observable<ScanResponseDto> {
        return timer(0,1000).pipe(
            switchMap(() => this.getScanStatus(scanId)),
            takeWhile(
                scan => scan.status === ScanStatus.PENDING || scan.status === ScanStatus.IN_PROGRESS,
                true
            )
        );
    }
}
