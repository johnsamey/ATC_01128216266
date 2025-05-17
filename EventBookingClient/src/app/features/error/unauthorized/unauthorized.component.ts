import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-container unauthorized" [class.dark-theme]="isDarkMode">
      <div class="error-content">
        <h1 class="error-title">403 - Unauthorized Access</h1>
        <p class="error-message">Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.</p>
        <a routerLink="/" class="error-button">Return to Home</a>
      </div>
    </div>
  `,
  styleUrls: ['../styles/styles.css']
})
export class UnauthorizedComponent implements OnInit {
  isDarkMode = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === 'dark';
    }
  }
} 