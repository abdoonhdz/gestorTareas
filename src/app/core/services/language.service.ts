import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languages = ['es', 'en'];

  constructor(private translate: TranslateService) {
    const browserLang = this.translate.getBrowserLang();
    const defaultLang = 'es';

    const langToUse = browserLang && this.languages.includes(browserLang) ? browserLang : defaultLang;

    this.translate.use(langToUse);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  getAvailableLanguages(): string[] {
    return this.languages;
  }
}
