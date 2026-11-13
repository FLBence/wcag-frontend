import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RegisterDto } from '../models/register-dto';
import { Observable, Subscription, timer } from 'rxjs';
import { LoginDto } from '../models/login-dto';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

/*
 * A felhasználói hitelesítéshez kapcsolódó műveletek kezelése.
 *
 * Felelős a regisztrációért, bejelentkezésért, jelszómódosításért,
 * valamint a bejelentkezési állapot és a JWT token lejáratának kezeléséért.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private timerSub?: Subscription;

  /*
   * A szolgáltatás inicializálása.
   *
   * Böngészőkörnyezetben ellenőrzi az eltárolt JWT token lejáratát,
   * és szükség esetén elindítja az időzítőt.
   */
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTokenTimer();
    }
  }

  /*
   * A felhasználó bejelentkezési állapotának ellenőrzése.
   *
   * Böngészőkörnyezetben az eltárolt JWT token megléte alapján határozza meg a bejelentkezési állapotot.
   */
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  /*
   * Új felhasználó regisztrációjának elküldése a backend felé.
   */
  registerUser(registerDto: RegisterDto): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/register`, registerDto, { responseType: 'text' });
  }

  /*
   * A felhasználó bejelentkezési adatainak továbbítása a backend felé.
   */
  loginUser(loginDto: LoginDto): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, loginDto);
  }

  /*
   * A felhasználó jelszómódosítási kérésének elküldése a backend felé.
   */
  changePassword(loginDto: LoginDto): Observable<string> {
    return this.httpClient.put(`${this.baseUrl}/changepass`, loginDto, { responseType: 'text' });
  }

  /*
   * A felhasználó kijelentkeztetése.
   *
   * Leállítja a token lejáratát figyelő időzítőt,
   * törli a böngészőben tárolt hitelesítési adatokat,
   * majd visszanavigál a főoldalra.
   */
  private logout(): void {
    this.stopTokenTimer();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  /*
   * A JWT token lejáratát figyelő időzítő elindítása.
   *
   * Kiolvassa a token lejárati idejét, kiszámítja a hátralévő időt,
   * majd annak leteltekor automatikusan kijelentkezteti a felhasználót.
   *
   * A token lejáratát kezelő metódusok megvalósításához mesterséges intelligencia segítségét vettem igénybe.
   */
  public startTokenTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const timeLeft = payload.exp - Math.floor(Date.now() / 1000);

      if (timeLeft <= 0) {
        this.logout();
        return;
      }

      this.stopTokenTimer();

      this.timerSub = timer(timeLeft * 1000).subscribe(() => this.logout());
    } catch (e) {
      console.error('Hibás token formátum', e);
      this.logout();
    }
  }

  /*
   * A korábban elindított tokenlejárati időzítő leállítása.
   */
  private stopTokenTimer(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = undefined;
    }
  }
}
