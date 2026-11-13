/*
 * Regisztrációhoz szükséges adatok struktúráját meghatározó interfész.
 */
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}
