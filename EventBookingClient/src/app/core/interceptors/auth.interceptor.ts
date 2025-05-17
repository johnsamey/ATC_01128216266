import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }

  if (token) {
    const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    request = request.clone({
      setHeaders: {
        Authorization: authToken
      }
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isPlatformBrowser(platformId)&& !request.url.includes('/Auth/login')) {
        localStorage.removeItem('token');
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
}; 