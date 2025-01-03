import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface SignupRequest {
  username: string;
  email: string;
  password: string;
  adresse: string;
  roles?: string[];
}

interface LoginRequest {
  username: string;
  password: string;
}

interface JwtResponse {
  token: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface MessageResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_SERVER = 'http://localhost:8085/api/auth';

  constructor(private httpClient: HttpClient) {}

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? `Client Error: ${error.error.message}`
      : `Server Error: ${error.status} - ${error.message}`;
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Save tokens to localStorage
  saveTokens(jwtResponse: JwtResponse): void {
    localStorage.setItem('token', jwtResponse.token);
    localStorage.setItem('refreshToken', jwtResponse.refreshToken);
    console.log('Tokens saved to localStorage:', jwtResponse);
  }

  // Retrieve current user roles from JWT token
  getCurrentUserRole(): string[] | null {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles || null;
      } catch (error) {
        console.error('Error decoding roles from token:', error);
        return null;
      }
    }
    return null;
  }

  // Retrieve the username of the currently logged-in user
  getUsername(): string | null {
    const token = localStorage.getItem('token');
    if (token && token.split('.').length === 3) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username || null;
      } catch (error) {
        console.error('Error decoding username from token:', error);
        return null;
      }
    }
    return null;
  }

  // User Signup
  signup(signupRequest: SignupRequest): Observable<MessageResponse> {
    return this.httpClient
      .post<MessageResponse>(`${this.API_SERVER}/signup`, signupRequest)
      .pipe(catchError(this.handleError));
  }

  // User Login
  signin(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.httpClient
      .post<JwtResponse>(`${this.API_SERVER}/signin`, loginRequest)
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          if (response.token && response.refreshToken) {
            this.saveTokens(response);
          }
        })
      );
  }

  // User Logout
  logout(refreshToken: string): Observable<MessageResponse> {
    return this.httpClient
      .post<MessageResponse>(`${this.API_SERVER}/logout`, { refreshToken })
      .pipe(
        catchError(this.handleError),
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        })
      );
  }
}
