import { ScanStatus } from "./scan-status";

export interface ScanResponse {
    id: number;
    status: ScanStatus;
    websiteUrl: string;
    scannedAt: string;
    completedAt: string;
}