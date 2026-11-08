import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { RegisterDto } from '../models/register-dto';
import { Observable, Subscription, takeWhile, timer } from 'rxjs';
import { LoginDto } from '../models/login-dto';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  private timerSub?: Subscription;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.starttokenTimer();
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  registerUser(registerDto: RegisterDto): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/register`, registerDto, { responseType: 'text' });
  }

  loginUser(loginDto: LoginDto): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, loginDto);
  }

  public starttokenTimer(): void {
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

      this.timerSub = timer(0, 1000)
        .pipe(takeWhile((n) => n <= timeLeft))
        .subscribe({
          complete: () => {
            this.logout();
          },
        });
    } catch (e) {
      console.error('Hibás token formátum', e);
      this.logout();
    }
  }

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

  private stopTokenTimer(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
      this.timerSub = undefined;
    }
  }
}
