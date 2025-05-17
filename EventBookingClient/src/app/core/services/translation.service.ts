import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language } from './language.service';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: Translations = {
    // Common
    'welcome': {
      en: 'Welcome',
      ar: 'مرحباً'
    },
    'login': {
      en: 'Login',
      ar: 'تسجيل الدخول'
    },
    'register': {
      en: 'Register',
      ar: 'تسجيل'
    },
    'logout': {
      en: 'Logout',
      ar: 'تسجيل الخروج'
    },
    'profile': {
      en: 'Profile',
      ar: 'الملف الشخصي'
    },
    'settings': {
      en: 'Settings',
      ar: 'الإعدادات'
    },
    'search': {
      en: 'Search',
      ar: 'بحث'
    },
    'submit': {
      en: 'Submit',
      ar: 'إرسال'
    },
    'cancel': {
      en: 'Cancel',
      ar: 'إلغاء'
    },
    'save': {
      en: 'Save',
      ar: 'حفظ'
    },
    'delete': {
      en: 'Delete',
      ar: 'حذف'
    },
    'edit': {
      en: 'Edit',
      ar: 'تعديل'
    },
    'loading': {
      en: 'Loading...',
      ar: 'جاري التحميل...'
    },
    'error': {
      en: 'Error',
      ar: 'خطأ'
    },
    'success': {
      en: 'Success',
      ar: 'نجاح'
    },
    'warning': {
      en: 'Warning',
      ar: 'تحذير'
    },
    'info': {
      en: 'Information',
      ar: 'معلومات'
    },
    'confirm': {
      en: 'Confirm',
      ar: 'تأكيد'
    },
    'back': {
      en: 'Back',
      ar: 'رجوع'
    },
    'next': {
      en: 'Next',
      ar: 'التالي'
    },
    'previous': {
      en: 'Previous',
      ar: 'السابق'
    },
    'home': {
      en: 'Home',
      ar: 'الرئيسية'
    },
    'events': {
      en: 'Events',
      ar: 'الفعاليات'
    },
    'bookings': {
      en: 'Bookings',
      ar: 'الحجوزات'
    },
    'admin': {
      en: 'Admin',
      ar: 'الإدارة'
    },
    'unauthorized': {
      en: 'Unauthorized Access',
      ar: 'غير مصرح'
    },
    'notFound': {
      en: 'Page Not Found',
      ar: 'الصفحة غير موجودة'
    }
  };

  private currentLang = new BehaviorSubject<string>('en');

  constructor() {}

  setLanguage(lang: string): void {
    this.currentLang.next(lang);
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  translate(key: string): string {
    const lang = this.currentLang.value as Language;
    return this.translations[key]?.[lang] || key;
  }

  addTranslation(key: string, en: string, ar: string): void {
    this.translations[key] = { en, ar };
  }
} 