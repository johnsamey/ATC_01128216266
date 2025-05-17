import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-unified-auth',
  templateUrl: './unified-auth.component.html',
  styleUrls: ['./unified-auth.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ToolbarComponent],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class UnifiedAuthComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isLoginView = true;
  isDarkMode = false;
  showLoginPassword = false;
  showRegisterPassword = false;
  private isBrowser: boolean;
  private returnUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        document.body.classList.add('dark-theme');
      }
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

      // Redirect if already logged in
      if (this.authService.isAuthenticated()) {
        const userRole = this.authService.getUserRole();
        this.redirectBasedOnRole(userRole);
      }
    }
  }

  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.errorMessage = '';
    this.successMessage = '';
  }

  toggleTheme(): void {
    if (this.isBrowser) {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPasswordVisibility(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value, this.returnUrl || undefined).subscribe({
      next: (response) => {
        const userRole = this.authService.getUserRole();
        if (this.returnUrl && this.returnUrl !== '/') {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.redirectBasedOnRole(userRole);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Invalid username or password';
        this.isLoading = false;
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Registration successful! Please login.';
        setTimeout(() => {
          this.isLoading = false;
          this.isLoginView = true;
          this.registerForm.reset();
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
        // If username already exists, focus on the username field
        if (error.message.includes('username is already taken')) {
          const usernameControl = this.registerForm.get('userName');
          if (usernameControl) {
            usernameControl.setErrors({ 'usernameExists': true });
            usernameControl.markAsTouched();
          }
        }
      }
    });
  }

  private redirectBasedOnRole(role: string): void {
    if (this.returnUrl && this.returnUrl !== '/') {
      this.router.navigate([this.returnUrl]);
    } else {
      this.router.navigate(['/']);
    }
  }
} 