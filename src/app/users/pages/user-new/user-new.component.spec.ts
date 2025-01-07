import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserNewComponent } from './user-new.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { RolesService } from '../../services/roles.service';
import { User } from '../../models/user.model';
import { Role } from '../../models/role.model';
import Swal from 'sweetalert2';
import { MaterialModule } from '../../../material/material.module';
import { AppModule } from '../../../app.module';
import { TranslateModule } from '@ngx-translate/core';

describe('UserNewComponent', () => {
  let component: UserNewComponent;
  let fixture: ComponentFixture<UserNewComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let rolesServiceSpy: jasmine.SpyObj<RolesService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: Partial<ActivatedRoute>;

  const mockRoles: Role[] = [
    { id: '1', name: 'Admin', description: 'Rol de administrador' },
    { id: '2', name: 'User', description: 'Rol de usuario' },
  ];

  const mockUser: User = {
    id: '123',
    name: 'Usuario de prueba',
    username: 'usuarioprueba',
    email: 'usuarioprueba@example.com',
    role: { id: '1', name: 'Admin' },
    password: 'Prueba@1234',
  };

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUserById', 'createUser', 'updateUser']);
    rolesServiceSpy = jasmine.createSpyObj('RolesService', ['getRoles']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.callFake((key: string) => (key === 'id' ? '123' : null)),
          has: jasmine.createSpy('has').and.returnValue(true),
          getAll: jasmine.createSpy('getAll').and.returnValue([]),
          keys: [],
        } as ParamMap,
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
        outlet: '',
        component: null,
        routeConfig: null,
        root: {} as any,
        parent: null,
        firstChild: null,
        children: [],
        title: undefined,
        pathFromRoot: [],
        queryParamMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
          has: jasmine.createSpy('has').and.returnValue(false),
          getAll: jasmine.createSpy('getAll').and.returnValue([]),
          keys: [],
        } as ParamMap,
      },
    };

    await TestBed.configureTestingModule({
      declarations: [UserNewComponent],
      imports: [ReactiveFormsModule, MaterialModule, AppModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: RolesService, useValue: rolesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNewComponent);
    component = fixture.componentInstance;

    rolesServiceSpy.getRoles.and.returnValue(of(mockRoles));
    usersServiceSpy.getUserById.and.returnValue(of(mockUser));
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los roles al inicializar', () => {
    expect(component.roles).toEqual(mockRoles);
    expect(rolesServiceSpy.getRoles).toHaveBeenCalled();
  });

  it('debería cargar los datos del usuario cuando se proporciona un userId', () => {
    expect(component.userId).toBe('123');
    expect(usersServiceSpy.getUserById).toHaveBeenCalledWith('123');
    expect(component.userForm.value.name).toBe(mockUser.name);
  });

  it('debería llamar a createUser al enviar un formulario válido cuando no está editando', (done) => {
    spyOn(Swal, 'fire').and.callFake(() =>
      Promise.resolve({
        isConfirmed: true,
      } as any)
    );

    component.userId = null;
    component.userForm.setValue({
      name: 'Nuevo Usuario',
      username: 'nuevousuario',
      email: 'nuevousuario@example.com',
      role: '1',
      password: 'Password@123',
      confirmPassword: 'Password@123',
    });

    const newUser: User = {
      id: jasmine.any(String) as unknown as string,
      name: 'Nuevo Usuario',
      username: 'nuevousuario',
      email: 'nuevousuario@example.com',
      role: { id: '1', name: 'Admin' },
      password: 'Password@123',
    };

    usersServiceSpy.createUser.and.returnValue(of(newUser));

    component.onSubmit();

    setTimeout(() => {
      expect(usersServiceSpy.createUser).toHaveBeenCalledWith(jasmine.objectContaining(newUser));
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
      done();
    });
  });
});
