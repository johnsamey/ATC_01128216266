import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  handleError(error: HttpErrorResponse): void {
    console.error('An error occurred:', error);

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error('Server-side error:', error);
      
      switch (error.status) {
        case 401: // Unauthorized
          this.handleUnauthorized();
          break;
        case 403: // Forbidden
          this.handleForbidden();
          break;
        case 404: // Not Found
          this.handleNotFound();
          break;
        case 500: // Internal Server Error
          this.handleServerError();
          break;
        default:
          this.handleGenericError(error);
      }
    }
  }

  private handleUnauthorized(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private handleForbidden(): void {
    this.router.navigate(['/unauthorized']);
  }

  private handleNotFound(): void {
    this.router.navigate(['/not-found']);
  }

  private handleServerError(): void {
    // You could implement a retry mechanism or show a server error page
    console.error('Server error occurred');
  }

  private handleGenericError(error: HttpErrorResponse): void {
    // Handle other types of errors
    console.error('Generic error:', error);
  }
} 