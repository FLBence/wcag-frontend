import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RegisterDto } from "../models/register-dto";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private httpClient = inject(HttpClient);
    private baseUrl = 'http://localhost:8080/api/auth';

    registerUser(registerDto: RegisterDto): Observable<string> {
        return this.httpClient.post(`${this.baseUrl}/register`, registerDto, {responseType: 'text'})
    }
}
