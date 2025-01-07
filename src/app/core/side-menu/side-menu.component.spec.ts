import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { SideMenuComponent } from './side-menu.component';
import { MaterialModule } from '../../material/material.module';
import { AppModule } from '../../app.module';
import { of } from 'rxjs';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let translateService: TranslateService;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['getName', 'getUserRole', 'logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      imports: [TranslateModule.forRoot(), MaterialModule, AppModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    translateService = TestBed.inject(TranslateService);

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el nombre y el rol del usuario en ngOnInit', () => {
    authServiceSpy.getName.and.returnValue('John Doe');
    authServiceSpy.getUserRole.and.returnValue('Administrador');
    spyOn(component, 'checkScreenSize');

    component.ngOnInit();

    expect(component.name).toBe('John Doe');
    expect(component.userRole).toBe('Administrador');
    expect(component.checkScreenSize).toHaveBeenCalled();
  });

  it('debería cambiar el idioma y guardarlo en localStorage', () => {
    spyOn(localStorage, 'setItem');
    spyOn(translateService, 'use');

    component.changeLanguage('en');

    expect(translateService.use).toHaveBeenCalledWith('en');
    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
    expect(component.selectedLanguage).toBe('en');
  });

  it('debería cerrar sesión y navegar a la página de inicio de sesión', () => {
    component.onLogout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería devolver true si el usuario tiene acceso basado en los roles', () => {
    component.userRole = 'Administrador';
    const result = component.hasAccess(['Administrador', 'Jefe de Proyecto']);

    expect(result).toBeTrue();
  });

  it('debería devolver false si el usuario no tiene acceso basado en los roles', () => {
    component.userRole = 'Desarrollador';
    const result = component.hasAccess(['Administrador', 'Jefe de Proyecto']);

    expect(result).toBeFalse();
  });

  it('debería alternar el estado del sidenav', () => {
    component.sidenavOpened = true;
    component.toggleSidenav();
    expect(component.sidenavOpened).toBeFalse();

    component.toggleSidenav();
    expect(component.sidenavOpened).toBeTrue();
  });
});
