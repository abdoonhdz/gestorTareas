import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { AppModule } from '../../../app.module';
import { TranslateModule } from '@ngx-translate/core';

describe('UsersComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let usersService: UsersService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule, TranslateModule.forRoot()],
      providers: [UsersService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
  });

  it('should load users', () => {
    const dummyUsers = [{ id: '1', name: 'John' }];

    const users: User[] = dummyUsers as User[];

    spyOn(usersService, 'getUsers').and.returnValue(of(users));

    component.loadUsers();
    fixture.detectChanges();

    expect(component.users).toEqual(users);
  });

  it('should navigate to create new user', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.createAction();
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/users/new']);
  });

  it('should navigate to user detail', () => {
    const userId = '1';
    const navigateSpy = spyOn(router, 'navigate');

    component.viewUserDetail(userId);
    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith([`/users/${userId}`]);
  });
});
