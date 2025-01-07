import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material/material.module';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule, MaterialModule, AppModule],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('debería crear la aplicación', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar la configuración del idioma', () => {
    const setDefaultLangSpy = spyOn(translateService, 'setDefaultLang').and.callThrough();
    const useLangSpy = spyOn(translateService, 'use').and.callThrough();

    component['initializeLanguage']();

    expect(setDefaultLangSpy).toHaveBeenCalledWith('es');
    expect(useLangSpy).toHaveBeenCalled();
    const savedLanguage = localStorage.getItem('language');
    expect(savedLanguage).toBeTruthy();
  });

  it('debería ocultar el menú lateral para las rutas excluidas', () => {
    const excludedRoutes = ['/login', '/unauthorized'];
    const spy = spyOnProperty(component['router'], 'url', 'get');

    excludedRoutes.forEach((route) => {
      spy.and.returnValue(route);
      expect(component.shouldShowSideMenu()).toBeFalse();
    });
  });

  it('debería mostrar el menú lateral para rutas que no están excluidas', () => {
    spyOnProperty(component['router'], 'url', 'get').and.returnValue('/tasks');
    expect(component.shouldShowSideMenu()).toBeTrue();
  });
});
