import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<Language>('en');
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('language') as Language;
      if (savedLang) {
        this.setLanguage(savedLang);
      } else {
        // Get browser language
        const browserLang = navigator.language.split('-')[0];
        this.setLanguage(browserLang === 'ar' ? 'ar' : 'en');
      }
    }
  }

  getCurrentLang(): Observable<Language> {
    return this.currentLang.asObservable();
  }

  setLanguage(lang: Language): void {
    if (this.isBrowser) {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      this.currentLang.next(lang);
    }
  }

  isRTL(): boolean {
    return this.currentLang.value === 'ar';
  }
} 