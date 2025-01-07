import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailComponent } from './user-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { RolesService } from '../../services/roles.service';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { AppModule } from '../../../app.module';
import { TranslateModule } from '@ngx-translate/core';

describe('UserDetailComponent', () => {
  let component: UserDetailComponent;
  let fixture: ComponentFixture<UserDetailComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getUserById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['snapshot']);
    mockActivatedRoute.snapshot.paramMap = new Map<string, string>();

    await TestBed.configureTestingModule({
      declarations: [UserDetailComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserDetailComponent);
    component = fixture.componentInstance;
  });

  describe('goBack', () => {
    it('debería navegar de regreso a la lista de usuarios', () => {
      component.goBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
    });
  });

  describe('goUpdate', () => {
    it('debería navegar a la página de actualización de usuario si el usuario está definido', () => {
      component.user = {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'password123',
        role: {
          id: '2',
          name: 'Admin',
          description: 'Administrator'
        }
      };
      component.goUpdate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/users/edit', '1']);
    });

    it('no debería navegar si el usuario no está definido', () => {
      component.goUpdate();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
