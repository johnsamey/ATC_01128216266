import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, shareReplay } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, AuthResponseDto, User } from '../models/auth.models';
import { ApiResponse } from '../models/api-response.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Auth`;
  private readonly TOKEN_KEY = 'token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private userData$: Observable<User> | null = null;
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;
  private isInitialized = false;
  private initializationSubject = new BehaviorSubject<boolean>(false);
  public initialization$ = this.initializationSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (this.isBrowser && this.getToken()) {
      this.fetchCurrentUser().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
          this.isInitialized = true;
          this.initializationSubject.next(true);
        },
        error: (error) => {
          this.logout();
          this.isInitialized = true;
          this.initializationSubject.next(true);
        }
      });
    } else {
      this.isInitialized = true;
      this.initializationSubject.next(true);
    }
  }

  login(loginDto: LoginDto, returnUrl?: string): Observable<AuthResponseDto> {
    this.userData$ = null;
    return this.http.post<ApiResponse<AuthResponseDto>>(`${this.apiUrl}/login`, loginDto)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            this.setToken(response.data.token);
            return response.data;
          }
          throw new Error(response.message);
        }),
        switchMap(authData =>
          this.fetchCurrentUser().pipe(
            tap(user => {
              this.currentUserSubject.next(user);
              if (returnUrl && this.isBrowser) {
                localStorage.setItem('returnUrl', returnUrl);
              }
            }),
            map(() => authData)
          )
        ),
        catchError(this.handleError)
      );
  }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/register`, registerDto)
      .pipe(
        tap(response => {
        }),
        map(response => {
          if (response.success) {
            return response;
          }
          throw new Error(response.message || 'Registration failed');
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.currentUserSubject.next(null);
    this.userData$ = null;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getToken();
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(this.TOKEN_KEY) : null;
  }
  
  isAdmin(): boolean {
    if (!this.isInitialized) {
      return false;
    }
    const user = this.getCurrentUser();
    return user?.roles.includes('Admin') || false;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string {
    if (!this.isInitialized) {
      return '';
    }
    const user = this.getCurrentUser();
    return user?.roles.includes('Admin') ? 'admin' : 'user';
  }

  getUserName(): string {
    if (!this.isInitialized) {
      return '';
    }
    const user = this.getCurrentUser();
    if (user) {
      return user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user.userName;
    }
    return '';
  }

  isUnauthorized(): boolean {
    return this.isBrowser && !this.getToken();
  }

  private fetchCurrentUser(): Observable<User> {
    if (!this.userData$) {
      this.userData$ = this.http.get<ApiResponse<User>>(`${this.apiUrl}/current-user`)
        .pipe(
          map(response => {
            if (response.success && response.data) {
              this.currentUserSubject.next(response.data);
              return response.data;
            }
            throw new Error(response.message || 'Failed to fetch user data');
          }),
          catchError(error => {
            if (error.status === 401) {
              this.logout();
            }
            return throwError(() => error);
          }),
          shareReplay(1)
        );
    }
    return this.userData$;
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        errorMessage = error.error.errors.join(', ');
      }
    }
    
    if (error.status === 400 && error.error?.message === 'User already exists') {
      errorMessage = 'This username is already taken. Please choose a different username.';
    }
    
    return throwError(() => new Error(errorMessage));
  }
} 