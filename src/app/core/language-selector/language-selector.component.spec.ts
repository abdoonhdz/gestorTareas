import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './language-selector.component';

describe('LanguageSelectorComponent', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [TranslateService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current language from localStorage or default to "es"', () => {
    spyOn(localStorage, 'getItem').and.returnValue('es');
    component.ngOnInit();
    expect(component.languageControl.value).toBe('es');

    component.languageControl.setValue('en');
    expect(component.languageControl.value).toBe('en');
  });

  it('should update language when form control changes', () => {
    spyOn(translateService, 'use').and.callThrough();
    component.languageControl.setValue('en');
    fixture.detectChanges();
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('should translate language options correctly', () => {
    const compiled = fixture.nativeElement;
    const options = compiled.querySelectorAll('option');
    expect(options[0].textContent.trim()).toBe('Español');
    expect(options[1].textContent.trim()).toBe('Inglés');
  });

  it('should set the language based on user selection', () => {
    spyOn(localStorage, 'setItem').and.callThrough();
    component.languageControl.setValue('en');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    expect(component.languageControl.value).toBe('en');
  });

  it('should handle language change events correctly', () => {
    spyOn(translateService, 'use').and.callThrough();
    component.onLanguageChange();
    expect(translateService.use).toHaveBeenCalled();
  });
});
