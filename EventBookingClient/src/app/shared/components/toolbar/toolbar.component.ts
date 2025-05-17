import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  @Input() isDarkMode = false;
  @Output() themeToggle = new EventEmitter<void>();
  showUserMenu = false;
  userName: string = '';
  isLoading = true;
  private authSubscription: Subscription | null = null;
  private initSubscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Wait for auth service to initialize
    this.initSubscription = this.authService.initialization$.subscribe(initialized => {
      if (initialized) {
        // Subscribe to user changes after initialization
        this.authSubscription = this.authService.currentUser$.subscribe(user => {
          if (user) {
            this.userName = user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.userName;
          } else {
            this.userName = '';
          }
          this.isLoading = false;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.initSubscription) {
      this.initSubscription.unsubscribe();
    }
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  handleLogout(): void {
    const currentUrl = this.router.url;
    // Check if current page requires authentication
    const requiresAuth = currentUrl.startsWith('/admin') || 
                        currentUrl.startsWith('/profile') || 
                        currentUrl.startsWith('/bookings');
    
    this.authService.logout();
    this.showUserMenu = false;
    this.isLoading = true;
    
    if (requiresAuth) {
      // Redirect to login with return URL
      this.router.navigate(['/auth'], { 
        queryParams: { returnUrl: currentUrl }
      });
    } else {
      // Redirect to home page if current page doesn't require auth
      this.router.navigate(['/']);
    }
  }

  toggleTheme(): void {
    this.themeToggle.emit();
  }
} 