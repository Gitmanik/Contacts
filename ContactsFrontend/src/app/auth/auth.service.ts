import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environment';

interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  token: string;
}
interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap(res => localStorage.setItem('authToken', res.token))
      );
  }

  register(data: RegisterRequest) {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/register`, data)
      .pipe(
        tap(res => localStorage.setItem('authToken', res.token))
      );
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  get token(): string | null {
    return localStorage.getItem('authToken');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
