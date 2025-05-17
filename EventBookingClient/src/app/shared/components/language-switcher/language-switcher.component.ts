import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button 
        class="lang-btn" 
        [class.active]="currentLang === 'en'"
        (click)="switchLanguage('en')"
        [attr.aria-label]="'Switch to English'">
        <span class="lang-flag">🇺🇸</span>
        <span class="lang-text">EN</span>
      </button>
      <button 
        class="lang-btn" 
        [class.active]="currentLang === 'ar'"
        (click)="switchLanguage('ar')"
        [attr.aria-label]="'Switch to Arabic'">
        <span class="lang-flag">🇸🇦</span>
        <span class="lang-text">عربي</span>
      </button>
    </div>
  `,
  styles: [`
    .language-switcher {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      background: transparent;
      color: var(--text-color);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .lang-btn:hover {
      background: var(--hover-color);
    }

    .lang-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .lang-flag {
      font-size: 1.2rem;
    }

    .lang-text {
      font-weight: 500;
    }

    :host-context(.dark-theme) .lang-btn {
      border-color: var(--border-color);
      color: var(--text-color);
    }

    :host-context(.dark-theme) .lang-btn:hover {
      background: var(--hover-color);
    }

    :host-context(.dark-theme) .lang-btn.active {
      background: var(--primary-color);
      color: white;
    }
  `]
})
export class LanguageSwitcherComponent implements OnInit {
  currentLang: Language = 'en';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });
  }

  switchLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
} 