import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSelectorComponent } from './language-selector.component';

describe('Componente LanguageSelector', () => {
  let component: LanguageSelectorComponent;
  let fixture: ComponentFixture<LanguageSelectorComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageSelectorComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSelectorComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializarse con el idioma actual de localStorage o por defecto con "es"', () => {
    spyOn(localStorage, 'getItem').and.returnValue('es');
    component.ngOnInit();
    expect(component.languageControl.value).toBe('es');

    component.languageControl.setValue('en');
    expect(component.languageControl.value).toBe('en');
  });

  it('debería actualizar el idioma cuando cambia el control del formulario', () => {
    spyOn(translateService, 'use').and.callThrough();
    component.languageControl.setValue('en');
    fixture.detectChanges();
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  it('debería traducir correctamente las opciones de idioma', () => {
    const compiled = fixture.nativeElement;
    const options = compiled.querySelectorAll('option');
    expect(options[0].textContent.trim()).toBe('Español');
    expect(options[1].textContent.trim()).toBe('Inglés');
  });

  it('debería establecer el idioma basado en la selección del usuario', () => {
    spyOn(localStorage, 'setItem').and.callThrough();
    component.languageControl.setValue('en');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    expect(component.languageControl.value).toBe('en');
  });

  it('debería manejar correctamente los eventos de cambio de idioma', () => {
    spyOn(translateService, 'use').and.callThrough();
    component.onLanguageChange();
    expect(translateService.use).toHaveBeenCalled();
  });
});
