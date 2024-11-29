import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivate {
  constructor(private translate: TranslateService) {}

  canActivate(): boolean {
    const storedLanguage = localStorage.getItem('language');

    if (storedLanguage) {
      this.translate.use(storedLanguage);
    } else {
      const defaultLanguage = 'es';
      this.translate.use(defaultLanguage);
      localStorage.setItem('language', defaultLanguage);
    }

    return true;
  }
}
