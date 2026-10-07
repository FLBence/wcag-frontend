import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable, switchMap, takeWhile, timer } from "rxjs";
import { ScanStatus } from "../models/scan-status";
import { ScanResponse } from "../models/scan-response";
import { ScanResultResponse } from "../models/scan-result-response";

@Injectable({
    providedIn: 'root'
})
export class ScanApiService {
    private httpClient = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/scans';

    createScan(websiteUrl: string): Observable<ScanResponse> {
        return this.httpClient.post<ScanResponse>(this.baseUrl, {websiteUrl})
    }

    startScan(scanId: number): Observable<string> {
        return this.httpClient.post(`${this.baseUrl}/${scanId}/start`, {}, { responseType: 'text'});
    }

    getScanStatus(scanId: number): Observable<ScanResponse> {
        return this.httpClient.get<ScanResponse>(`${this.baseUrl}/${scanId}`);
    }

    getScanResults(scanId: number): Observable<ScanResultResponse[]> {
        return this.httpClient.get<ScanResultResponse[]>(`${this.baseUrl}/${scanId}/results`);
    }

    currentScanStatus(scanId: number): Observable<ScanResponse> {
        return timer(0,1000).pipe(
            switchMap(() => this.getScanStatus(scanId)),
            takeWhile(
                scan => scan.status === 'PENDING' || scan.status === 'IN_PROGRESS',
                true
            )
        );
    }
}
