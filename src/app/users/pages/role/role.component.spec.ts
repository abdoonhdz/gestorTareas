// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
// import { RoleComponent } from './role.component';
// import { RolesService } from '../../services/roles.service';
// import { of } from 'rxjs';
// import { Role } from '../../models/role.model';
// import Swal from 'sweetalert2';
// import { MaterialModule } from '../../../material/material.module';
// import { AppModule } from '../../../app.module';

// fdescribe('RoleComponent', () => {
//   let component: RoleComponent;
//   let fixture: ComponentFixture<RoleComponent>;
//   let rolesServiceSpy: jasmine.SpyObj<RolesService>;

//   const mockRoles: Role[] = [
//     { id: '1', name: 'Admin', description: 'Administrator role' },
//     { id: '2', name: 'User', description: 'User role' },
//   ];

//   beforeEach(async () => {
//     rolesServiceSpy = jasmine.createSpyObj('RolesService', ['getRoles', 'createRole', 'updateRole', 'deleteRole']);

//     await TestBed.configureTestingModule({
//       declarations: [RoleComponent],
//       imports: [ReactiveFormsModule, MaterialModule],
//       providers: [
//         FormBuilder,
//         { provide: RolesService, useValue: rolesServiceSpy },
//       ],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(RoleComponent);
//     component = fixture.componentInstance;

//     rolesServiceSpy.getRoles.and.returnValue(of(mockRoles));
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should load roles on init', () => {
//     expect(component.roles).toEqual(mockRoles);
//     expect(rolesServiceSpy.getRoles).toHaveBeenCalled();
//   });

//   it('should initialize the form', () => {
//     expect(component.roleForm).toBeDefined();
//     expect(component.roleForm.controls['name']).toBeTruthy();
//     expect(component.roleForm.controls['description']).toBeTruthy();
//   });

//   it('should call createRole on valid form submission when not editing', () => {
//     spyOn(Swal, 'fire').and.callFake(() =>
//       Promise.resolve({
//         isConfirmed: true,
//       } as any)
//     );

//     const newRole: Role = { id: '3', name: 'Manager', description: 'Manager role' };

//     component.roleForm.setValue({
//       name: newRole.name,
//       description: newRole.description,
//     });

//     rolesServiceSpy.createRole.and.returnValue(of(newRole));

//     component.onSubmit();

//     expect(rolesServiceSpy.createRole).toHaveBeenCalledWith(jasmine.objectContaining({
//       id: jasmine.any(String),
//       name: newRole.name,
//       description: newRole.description,
//     }));
//   });

//   it('should call updateRole on valid form submission when editing', () => {
//     spyOn(Swal, 'fire').and.callFake(() =>
//       Promise.resolve({
//         isConfirmed: true,
//       } as any)
//     );

//     const updatedRole: Role = { id: '1', name: 'Super Admin', description: 'Updated description' };

//     component.editingRoleId = updatedRole.id;
//     component.roleForm.setValue({
//       name: updatedRole.name,
//       description: updatedRole.description,
//     });

//     rolesServiceSpy.updateRole.and.returnValue(of(updatedRole));

//     component.onSubmit();

//     expect(rolesServiceSpy.updateRole).toHaveBeenCalledWith(updatedRole.id, jasmine.objectContaining({
//       name: updatedRole.name,
//       description: updatedRole.description,
//     }));
//   });

//   it('should reset the form and clear editingRoleId on resetForm', () => {
//     component.editingRoleId = '1';
//     component.roleForm.setValue({
//       name: 'Test Role',
//       description: 'Test description',
//     });

//     component.resetForm();

//     expect(component.editingRoleId).toBeNull();
//     expect(component.roleForm.value).toEqual({ name: '', description: '' });
//   });

//   it('should call deleteRole and refresh roles on delete', () => {
//     spyOn(Swal, 'fire').and.callFake(() =>
//       Promise.resolve({
//         isConfirmed: true,
//       } as any)
//     );

//     rolesServiceSpy.deleteRole.and.returnValue(of(undefined));

//     component.onDelete('1');

//     expect(rolesServiceSpy.deleteRole).toHaveBeenCalledWith('1');
//     expect(rolesServiceSpy.getRoles).toHaveBeenCalled();
//   });
// });
