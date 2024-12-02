import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Gestor de Tareas';

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    this.initializeLanguage();
  }

  ngOnInit() {}

  private initializeLanguage(): void {
    const defaultLang = 'es';
    const supportedLanguages = ['en', 'es'];

    this.translate.addLangs(supportedLanguages);
    this.translate.setDefaultLang(defaultLang);

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      this.translate.use(savedLanguage);
    } else {
      const browserLang = this.translate.getBrowserLang() || defaultLang;
      const languageToUse = supportedLanguages.includes(browserLang) ? browserLang : defaultLang;
      this.translate.use(languageToUse);
      localStorage.setItem('language', languageToUse);
    }

  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData['animation'];
  }

  shouldShowSideMenu(): boolean {
    const excludedRoutes = ['/login', '/unauthorized'];
    return !excludedRoutes.includes(this.router.url);
  }
}

