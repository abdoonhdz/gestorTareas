import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit{

  users: User[] = [];

  constructor (
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
      this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  createAction() {
    this.router.navigate(['/users/new']);
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Este usuario será eliminado permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
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
        this.usersService.deleteUser(userId).subscribe(() => {
          this.loadUsers();
          Swal.fire({
            title: '¡Usuario eliminado!',
            text: 'El usuario ha sido eliminado con éxito.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#008686',
            customClass: {
              popup: 'swal-popup',
              confirmButton: 'swal-confirm-btn'
            },
            background: '#101414',
            color: 'white'
          });
        }, (error) => {
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al eliminar el usuario. Intenta nuevamente.',
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
        });
      }
    });
  }

}
