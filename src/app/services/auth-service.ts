import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RegisterDto } from '../models/register-dto';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login-dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/auth';

  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLoggedIn');
  }

  registerUser(registerDto: RegisterDto): Observable<string> {
    return this.httpClient.post(`${this.baseUrl}/register`, registerDto, { responseType: 'text' });
  }

  loginUser(loginDto: LoginDto): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, loginDto);
  }
}
