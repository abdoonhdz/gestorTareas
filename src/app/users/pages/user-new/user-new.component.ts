import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {
  userForm!: FormGroup;
  users: User[] = [];

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
      private fb: FormBuilder,
      private usersService: UsersService,
      private router: Router
    ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Por favor, completa todos los campos correctamente.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        customClass: {
          popup: 'swal-popup',
          confirmButton: 'swal-confirm-btn'
        },
        background: 'black',
        color: 'white'
      });
      return;
    }

    const { confirmPassword, ...userData } = this.userForm.value;

    const userWithId = { id: uuid(), ...userData };

    this.usersService.createUser(userWithId).subscribe(
      (newUser) => {
        this.users.push(newUser);

        Swal.fire({
          title: '¡Éxito!',
          text: 'El usuario ha sido creado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Crear otro',
          showCancelButton: true,
          confirmButtonColor: '#008686',
          cancelButtonColor: '#ff6d5d',
          customClass: {
            popup: 'swal-popup',
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
          },
          background: '#101414',
          color: 'white'
        }).then((result) => {
          if (result.isConfirmed) {
            this.userForm.reset();
            this.router.navigate(['/users']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.userForm.reset();
            window.location.reload();
          }
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al crear el usuario. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#008686',
          customClass: {
            popup: 'swal-popup',
            confirmButton: 'swal-confirm-btn'
          },
          background: '#101414',
          color: 'white'
        });
      }
    );
  }

  goBackButton() {
    this.router.navigate(['/users']);
  }

}
