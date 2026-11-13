/*
 * A WCAG vizsgálatok során a szkenn lehetséges státuszának meghatározása.
 */
export enum ScanStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABORTED = 'ABORTED',
}
