import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {
  languageControl: FormControl;

  constructor(private translate: TranslateService) {
    this.languageControl = new FormControl(localStorage.getItem('language') || 'es');
  }

  ngOnInit(): void {
    const currentLanguage = this.languageControl.value;
    this.translate.setDefaultLang('es');
    this.translate.use(currentLanguage);

    localStorage.setItem('language', currentLanguage);

    this.languageControl.valueChanges.subscribe((language) => {
      this.translate.use(language);
      localStorage.setItem('language', language);
    });
  }

  onLanguageChange(): void {
    const selectedLanguage = this.languageControl.value;
    this.translate.use(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  }
}
