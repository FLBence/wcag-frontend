import { ScanStatus } from './scan-status';

export interface ScanResponseDto {
  id: number;
  status: ScanStatus;
  websiteUrl: string;
  scannedAt: string;
  completedAt: string;
}
