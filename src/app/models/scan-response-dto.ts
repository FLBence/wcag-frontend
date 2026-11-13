import { ScanStatus } from './scan-status';
/*
 * A WCAG vizsgálat adatainak struktúráját meghatározó interfész.
 */
export interface ScanResponseDto {
  id: number;
  status: ScanStatus;
  websiteUrl: string;
  scannedAt: string;
  completedAt: string;
}
