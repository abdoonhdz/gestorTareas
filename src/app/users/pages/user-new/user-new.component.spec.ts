// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { UserNewComponent } from './user-new.component';
// import { UsersService } from '../../services/users.service';
// import { ReactiveFormsModule } from '@angular/forms';
// import { of } from 'rxjs';
// import { User } from '../../models/user.model';

// describe('UserNewComponent', () => {
//   let component: UserNewComponent;
//   let fixture: ComponentFixture<UserNewComponent>;
//   let usersService: UsersService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [ReactiveFormsModule],
//       declarations: [UserNewComponent],
//       providers: [UsersService]
//     }).compileComponents();

//     fixture = TestBed.createComponent(UserNewComponent);
//     component = fixture.componentInstance;
//     usersService = TestBed.inject(UsersService);
//     fixture.detectChanges();
//   });

//   describe('createUser method', () => {
//     it('should call createUser with a valid user object', () => {
//       const user: User = {
//         id: '1',
//         name: 'Test User',
//         username: 'testuser',
//         email: 'testuser@example.com',
//         role: {
//           id: '1',
//           name: 'Admin'
//         },
//         password: 'securepassword'
//       };

//       spyOn(usersService, 'createUser').and.returnValue(of(user));

//       component.createUser(user);

//       expect(usersService.createUser).toHaveBeenCalledWith(user);
//     });

//     it('should handle error if required properties are missing', () => {
//       const user: Partial<User> = {
//         id: '2',
//         name: 'Incomplete User',
//         username: 'incompleteuser',
//         email: 'incompleteuser@example.com',
//         role: {
//           id: '2',
//           name: 'User'
//         }
//       };

//       spyOn(usersService, 'createUser').and.returnValue(of({}));

//       component.createUser(user as User); // Pass it explicitly

//       expect(usersService.createUser).toHaveBeenCalledWith({
//         ...user,
//         password: '' // Make sure password is defined even if not passed
//       });
//     });
//   });

//   describe('updateUser method', () => {
//     it('should call updateUser with a valid user object', () => {
//       const user: User = {
//         id: '1',
//         name: 'Updated User',
//         username: 'updateduser',
//         email: 'updateduser@example.com',
//         role: {
//           id: '1',
//           name: 'Admin'
//         },
//         password: 'newsecurepassword'
//       };

//       spyOn(usersService, 'updateUser').and.returnValue(of(user));

//       component.updateUser(user);

//       expect(usersService.updateUser).toHaveBeenCalledWith(user.id, user);
//     });

//     it('should handle errors when necessary properties are missing', () => {
//       const user: Partial<User> = {
//         id: '1',
//         name: 'User Without Password',
//         username: 'userwithoutpassword',
//         email: 'userwithoutpassword@example.com',
//         role: {
//           id: '1',
//           name: 'Admin'
//         }
//       };

//       spyOn(usersService, 'updateUser').and.returnValue(of({}));

//       component.updateUser(user as User); // Pass explicitly with missing password

//       expect(usersService.updateUser).toHaveBeenCalledWith({
//         ...user,
//         password: '' // Ensure password is properly included
//       });
//     });
//   });

//   describe('loadRoles method', () => {
//     it('should call loadRoles', () => {
//       spyOn(component, 'loadRoles').and.callThrough();

//       component.loadRoles();

//       expect(component.loadRoles).toHaveBeenCalled();
//     });
//   });

//   describe('Form Validations', () => {
//     it('should require the "name" control to be filled', () => {
//       const nameControl = component.userForm.controls['name'];
//       nameControl.setValue('');
//       expect(nameControl.valid).toBeFalsy();
//     });

//     it('should require the "email" control to be filled', () => {
//       const emailControl = component.userForm.controls['email'];
//       emailControl.setValue('');
//       expect(emailControl.valid).toBeFalsy();
//     });

//     it('should require the password and confirm password to match', () => {
//       const formGroup = component.fb.group({
//         password: ['password1'],
//         confirmPassword: ['password2']
//       });

//       const result = component.passwordMatchValidator(formGroup);

//       expect(result).toBeFalsy();
//     });
//   });

//   describe('getRoleName method', () => {
//     it('should return the correct role name', () => {
//       const roleName = component.getRoleName('1');
//       expect(roleName).toBe('Admin');
//     });
//   });
// });
