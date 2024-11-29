import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';
import { Role } from '../../models/role.model';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {
  userForm!: FormGroup;
  roles: Role[] = [];
  hidePassword = true;
  hideConfirmPassword = true;
  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.initializeForm();
    this.loadRoles();

    if (this.userId) {
      this.loadUserData();
    }
  }

  initializeForm(): void {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        password: [
          '',
          this.userId
            ? []
            : [
                Validators.required,
                Validators.pattern(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
                ),
              ],
        ],
        confirmPassword: ['', this.userId ? [] : Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private loadRoles(): void {
    this.rolesService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  private loadUserData(): void {
    this.usersService.getUserById(this.userId!).subscribe(
      (user) => {
        this.userForm.patchValue({
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role.id,
          password: '',
          confirmPassword: '',
        });
      },
      (error) => {
        Swal.fire('Error', 'No se pudo cargar el usuario.', 'error');
      }
    );
  }



  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (!password && !confirmPassword) return null;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.showAlert('Formulario inválido', 'Por favor, completa todos los campos correctamente.', 'warning');
      return;
    }

    const { confirmPassword, role, ...userData } = this.userForm.value;
    const formattedUser = {
      ...userData,
      role: { id: role, name: this.getRoleName(role) },
    };

    if (this.userId) {
      this.updateUser(formattedUser);
    } else {
      this.createUser({ id: uuid(), ...formattedUser });
    }
  }

  private updateUser(user: User): void {
    this.usersService.updateUser(this.userId!, user).subscribe(() => {
        this.showAlert('¡Éxito!', 'El usuario ha sido actualizado con éxito.', 'success', true);
      },() => {
        this.showAlert('Error', 'No se pudo actualizar el usuario. Intenta nuevamente.', 'error');
      }
    );
  }

  private createUser(user: User): void {
    this.usersService.createUser(user).subscribe(() => {
        this.showAlert('¡Éxito!', 'El usuario ha sido creado con éxito.', 'success', true);
      },() => {
        this.showAlert('Error', 'No se pudo crear el usuario. Intenta nuevamente.', 'error');
      }
    );
  }

  private getRoleName(roleId: string): string {
    return this.roles.find((role) => role.id === roleId)?.name || '';
  }

  private showAlert(title: string, text: string, icon: any, redirect = false): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
      background: '#101414',
      color: 'white',
    }).then((result) => {
      if (redirect && result.isConfirmed) {
        this.userForm.reset();
        this.router.navigate(['/users']);
      }
    });
  }

  goBackButton(): void {
    this.router.navigate(['/users']);
  }
}
