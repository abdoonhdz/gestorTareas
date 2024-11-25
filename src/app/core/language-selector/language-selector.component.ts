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
    this.languageControl = new FormControl('es');
  }

  ngOnInit(): void {
    this.translate.setDefaultLang('es');
    this.translate.use(this.languageControl.value);
  }

  onLanguageChange(): void {
    this.translate.use(this.languageControl.value);
  }
}
