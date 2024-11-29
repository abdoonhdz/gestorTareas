import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { Role } from '../../models/role.model';
import { v4 as uuid } from 'uuid';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  roleForm!: FormGroup;
  editingRoleId: string | null = null;

  constructor(private rolesService: RolesService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadRoles();
    this.initializeForm();
  }

  loadRoles(): void {
    this.rolesService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  initializeForm(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.swalWithCustomStyle({
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const roleData: Role = this.roleForm.value;

    if (this.editingRoleId) {
      this.rolesService.updateRole(this.editingRoleId, roleData).subscribe(() => {
        this.swalWithCustomStyle({
          title: '¡Éxito!',
          text: 'El rol ha sido actualizado.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
        }).then(() => {
          window.location.reload();
        });
      });
    } else {
      const { id, ...roleDataWithoutId } = roleData;
      const newRole: Role = { id: uuid(), ...roleDataWithoutId };
      this.rolesService.createRole(newRole).subscribe(() => {
        this.swalWithCustomStyle({
          title: '¡Éxito!',
          text: 'El rol ha sido creado.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          showCancelButton: false,
        }).then(() => {
          window.location.reload();
        });
      });
    }
  }


  onEdit(role: Role): void {
    this.editingRoleId = role.id;
    this.roleForm.patchValue(role);
  }

  onDelete(roleId: string): void {
    this.swalWithCustomStyle({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el rol permanentemente.',
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolesService.deleteRole(roleId).subscribe(() => {
          this.swalWithCustomStyle({
            title: '¡Eliminado!',
            text: 'El rol ha sido eliminado.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            showCancelButton: false,
          });
          this.loadRoles();
        });
      }
    });
  }

  resetForm(): void {
    this.roleForm.reset();
    this.editingRoleId = null;
  }

  private swalWithCustomStyle(options: any): Promise<any> {
    const defaultOptions = {
      background: '#101414',
      color: 'white',
      customClass: {
        popup: 'swal-popup',
        confirmButton: 'swal-confirm-btn',
      },
      confirmButtonColor: '#008686',
      cancelButtonColor: '#ff5c49',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    };
    return Swal.fire({ ...defaultOptions, ...options });
  }
}
