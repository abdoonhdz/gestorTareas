import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { AppModule } from '../../app.module';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getName', 'getUserRole', 'logout']);
    translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use', 'getBrowserLang']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      imports: [AppModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;

    authServiceSpy.getName.and.returnValue('Jose');
    authServiceSpy.getUserRole.and.returnValue('Administrador');
    translateServiceSpy.getBrowserLang.and.returnValue('es');
    translateServiceSpy.use.and.stub();

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.name).toBeDefined();
    expect(component.userRole).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user name and role on init', () => {
    expect(component.name).toBe('Jose');
    expect(component.userRole).toBe('Administrador');
  });

  it('should toggle sidenav', () => {
    component.toggleSidenav();
    expect(component.sidenavOpened).toBeFalse();

    component.toggleSidenav();
    expect(component.sidenavOpened).toBeTrue();
  });

  it('should call authService.logout on onLogout', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update language on changeLanguage', () => {
    component.changeLanguage('en');
    expect(translateServiceSpy.use).toHaveBeenCalledWith('en');
    expect(localStorage.getItem('language')).toBe('en');
    expect(component.selectedLanguage).toBe('en');
  });

  it('should handle screen resize correctly', () => {
    window.innerWidth = 1800;
    window.dispatchEvent(new Event('resize'));
    expect(component.isScreenSmall).toBeFalse();
    expect(component.sidenavOpened).toBeTrue();
  });

  it('should determine access based on roles', () => {
    expect(component.hasAccess(['Administrador'])).toBeTrue();
    expect(component.hasAccess(['Desarrollador'])).toBeFalse();
  });
});
