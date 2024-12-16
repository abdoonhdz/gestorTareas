import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginComponent } from './login.component';
import { AuthService } from './../../services/auth.service';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../../material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: any;
  let mockRouter: any;
  let snackBarSpy: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jasmine.createSpy('login').and.returnValue(of(true)),
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario de inicio de sesión con campos vacíos', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.value).toEqual({ username: '', password: '' });
  });

  it('debería validar los campos del formulario correctamente', () => {
    const username = component.loginForm.get('username');
    const password = component.loginForm.get('password');

    expect(username?.valid).toBeFalse();
    expect(password?.valid).toBeFalse();

    username?.setValue('us');
    password?.setValue('pass');

    expect(username?.valid).toBeFalse();
    expect(password?.valid).toBeFalse();

    username?.setValue('user123');
    password?.setValue('password123');

    expect(username?.valid).toBeTrue();
    expect(password?.valid).toBeTrue();
  });

  it('debería llamar a AuthService.login cuando el formulario sea válido y se envíe', () => {
    component.loginForm.setValue({ username: 'validUser', password: 'validPass' });
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('validUser', 'validPass');
  });

  it('debería navegar a /tasks en caso de inicio de sesión exitoso', () => {
    mockAuthService.login.and.returnValue(of(true));

    component.loginForm.setValue({ username: 'validUser', password: 'validPass' });
    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('debería mostrar un snackbar en caso de inicio de sesión fallido', () => {
    mockAuthService.login.and.returnValue(of(false));

    component.loginForm.setValue({ username: 'invalidUser', password: 'invalidPass' });
    component.onSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Usuario o contraseña incorrectos',
      'Cerrar',
      jasmine.objectContaining({ duration: 3000 })
    );
  });

  it('no debería llamar a AuthService.login si el formulario es inválido', () => {
    component.loginForm.setValue({ username: '', password: '' });
    component.onSubmit();

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('debería alternar entre mostrar/ocultar contraseña al cambiar hidePassword', () => {
    expect(component.hidePassword).toBeTrue();
    component.hidePassword = false;
    expect(component.hidePassword).toBeFalse();
  });

  it('debería deshabilitar el botón de envío si el formulario es inválido', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    component.loginForm.setValue({ username: '', password: '' });
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeTrue();

    component.loginForm.setValue({ username: 'user', password: 'password123' });
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeFalse();
  });
});
