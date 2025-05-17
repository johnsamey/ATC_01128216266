import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="error-container not-found" [class.dark-theme]="isDarkMode">
      <div class="error-content">
        <h1 class="error-title">404 - Page Not Found</h1>
        <p class="error-message">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <a routerLink="/" class="error-button">Return to Home</a>
      </div>
    </div>
  `,
  styleUrls: ['../styles/styles.css']
})
export class NotFoundComponent implements OnInit {
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