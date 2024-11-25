import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageGuard implements CanActivate {
  constructor(private translate: TranslateService) {}

  canActivate(): boolean {
    const savedLanguage = localStorage.getItem('language') || 'es';
    this.translate.use(savedLanguage);
    return true;
  }
}
