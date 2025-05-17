import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth']);
    }

    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      if (currentUser.roles.includes('Admin')) {
      return true;
    }
      return this.router.createUrlTree(['/unauthorized']);
    }

    return this.authService.currentUser$.pipe(
      filter(user => user !== null),
      take(1),
      map(user => {
        if (user.roles.includes('Admin')) {
          return true;
        }
        return this.router.createUrlTree(['/unauthorized']);
      }),
      catchError(() => of(this.router.createUrlTree(['/auth'])))
    );
  }
} 