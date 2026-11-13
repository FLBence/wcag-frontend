/*
 * Új WCAG vizsgálat létrehozásához szükséges kérésadatok struktúráját meghatározó interfész.
 */
export interface CreateScanRequestDto {
  websiteUrl: string;
  id: number;
}
