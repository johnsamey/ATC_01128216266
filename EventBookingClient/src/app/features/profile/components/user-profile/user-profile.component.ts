import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { UserProfile } from '../../../../core/models/user-profile.model';
import { ToolbarComponent } from '../../../../shared/components/toolbar/toolbar.component';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface EventFilter {
  id: string;
  label: string;
  icon: string;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToolbarComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: UserProfile | null = null;
  isEditing = false;
  isLoading = false;
  showDeleteModal = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isDarkMode = false;
  activeTab = 'personal';
  activeEventFilter = 'upcoming';
  private isBrowser: boolean;
  showPasswordSuccess = false;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  tabs: Tab[] = [
    { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
    { id: 'events', label: 'Events', icon: 'fas fa-calendar-alt' },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt' },
    { id: 'account', label: 'Account', icon: 'fas fa-cog' }
  ];

  eventFilters: EventFilter[] = [
    { id: 'upcoming', label: 'Upcoming', icon: 'fas fa-calendar-day' },
    { id: 'past', label: 'Past', icon: 'fas fa-history' },
    { id: 'cancelled', label: 'Cancelled', icon: 'fas fa-ban' }
  ];

  events: Event[] = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      date: new Date('2024-04-15T09:00:00'),
      location: 'Convention Center, New York',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Workshop: Web Development',
      date: new Date('2024-03-20T14:00:00'),
      location: 'Tech Hub, San Francisco',
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Networking Event',
      date: new Date('2024-02-10T18:00:00'),
      location: 'Business Center, Chicago',
      status: 'past'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      username: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Check for saved theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode = true;
        document.body.classList.add('dark-theme');
      }
    }
    this.loadUserProfile();
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

  private passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = response.data;
        console.log("this.user", this.user);
        if (this.user) {
          this.profileForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            username: this.user.userName,
            email: this.user.email
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.isLoading = false;
      }
    });
  }

  startEditing(): void {
    this.isEditing = true;
  }

  cancelEditing(): void {
    this.isEditing = false;
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        username: this.user.userName,
        email: this.user.email
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    // Only include fields that have been changed
    const formValue = this.profileForm.value;
    const updateData: { [key: string]: string } = {};
    
    Object.keys(formValue).forEach(key => {
      if (formValue[key] && formValue[key] !== this.user?.[key as keyof UserProfile]) {
        updateData[key] = formValue[key];
      }
    });

    if (Object.keys(updateData).length === 0) {
      this.isEditing = false;
      return;
    }

    this.isLoading = true;
    this.userService.updateUser(updateData).subscribe({
      next: (response) => {
        this.user = response.data;
        this.isEditing = false;
        this.isLoading = false;
        // Show success message
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.isLoading = false;
        // Show error message
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.userService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.isLoading = false;
        this.showPasswordSuccess = true;
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.isLoading = false;
        // Show error message
      }
    });
  }

  closePasswordSuccess(): void {
    this.showPasswordSuccess = false;
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deleteAccount(): void {
    this.isLoading = true;
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error deleting account:', error);
        this.isLoading = false;
        this.showDeleteModal = false;
        // Show error message
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.isEditing ? this.profileForm.get(fieldName) : this.passwordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.isEditing ? this.profileForm.get(fieldName) : this.passwordForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'This field is required';
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field.hasError('maxlength')) {
      return 'Maximum length is 50 characters';
    }
    if (field.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    if (field.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }
} 