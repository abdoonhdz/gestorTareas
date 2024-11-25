import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { CategoriesService } from '../../../categories/services/categories.service';
import { Categories } from '../../../categories/models/categories.model';
import { User } from '../../../users/models/user.model';
import { UsersService } from '../../../users/services/users.service';

@Component({
  selector: 'task-form-generic',
  templateUrl: './task-form-generic.component.html',
  styleUrls: ['./task-form-generic.component.css']
})
export class TaskFormGenericComponent implements OnInit {
  @Input() taskId: string | null = null;
  taskForm: FormGroup;
  task: Task | null = null;

  categories: Categories[] = [];
  availableTasks: Task[] = [];
  subtasks: Task[] = [];
  users: User[] = [];


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private usersService : UsersService ,
    private categoriesService: CategoriesService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(6)]],
      assignedTo: ['', [Validators.required, Validators.minLength(3)]],
      priority: ['', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required],
      estimatedTime: ['', [Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      subtasks: [[]],
    });
  }

  ngOnInit(): void {
    if (this.taskId) {
      console.log('Cargando tarea con ID:', this.taskId);
      this.loadTask();
    }
    this.loadCategories();
    this.loadAvailableTasks();
    this.loadUsers();

    this.taskForm.get('category')?.valueChanges.subscribe((category) => {
      if (category.name === 'Épica') {
        this.taskForm.get('estimatedTime')?.clearValidators();
        this.taskForm.get('description')?.clearValidators();
        this.taskForm.get('assignedTo')?.clearValidators();
      } else {
        this.taskForm.get('estimatedTime')?.setValidators([Validators.required, Validators.pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/)]);
        this.taskForm.get('description')?.setValidators([Validators.required, Validators.minLength(20)]);
        this.taskForm.get('assignedTo')?.setValidators([Validators.required, Validators.minLength(3)]);
      }

      this.taskForm.get('estimatedTime')?.updateValueAndValidity();
      this.taskForm.get('description')?.updateValueAndValidity();
      this.taskForm.get('assignedTo')?.updateValueAndValidity();
    });

  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  loadAvailableTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.availableTasks = tasks.filter(
        task => task.id !== +this.taskId! && task.status !== 'completada' && task.category.name !== 'Épica'
      );
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadTask(): void {
    this.taskService.getTaskById(this.taskId!).subscribe(task => {
      this.task = task;
      this.taskForm.patchValue(task);

      console.log('Categoría de la tarea:', task.category.name);

      if (task.category.name === 'Épica') {
        this.loadSubtasks(task.subtasks || []);
        this.taskForm.get('assignedTo')?.disable();
        this.taskForm.get('description')?.disable();
        this.taskForm.get('estimatedTime')?.disable();
      }
    });
  }

  loadSubtasks(subtaskIds: number[]): void {
    if (subtaskIds.length > 0) {
      console.log('Subtareas cargadas:', subtaskIds);
      this.taskService.getTasksByIds(subtaskIds).subscribe(subtasks => {
        console.log('Subtareas obtenidas:', subtasks);
        this.subtasks = subtasks;
      });
    }
  }


  compareCategories(c1: Categories, c2: Categories): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.taskId) {

        if (this.task && this.task.category.name !== 'Épica' && this.taskForm.get('category')?.value.name === 'Épica') {
          Swal.fire({
            title: 'Error',
            text: 'No se puede cambiar la categoría a "Épica" porque ya tiene una categoría asignada.',
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
          return;
        }

        const updatedTask = this.taskForm.value;
        this.updateTask(updatedTask);
      } else {
        const newTask = this.taskForm.value;
        this.createTask(newTask);
      }
    } else {
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
    }
  }

  createTask(task: Task): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.taskForm.value;

      if (newTask.category.name === 'Épica') {
        newTask.subtasks = this.taskForm.get('subtasks')?.value || [];
      }

      try {
        firstValueFrom(this.taskService.createTask(newTask));

        Swal.fire({
          title: '¡Éxito!',
          text: 'La tarea ha sido creada con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Crear otra',
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
            this.router.navigate(['/tasks']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            this.taskForm.reset();
            window.location.reload();
          }
        });

      } catch (error) {

        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al crear la tarea. Intenta nuevamente.',
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
    } else {

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
    }
  }

  updateTask(task: Task): void {

    if (task.category.name === 'Épica') {
      task.subtasks = this.taskForm.get('subtasks')?.value || [];
    }

    firstValueFrom(this.taskService.updateTask(this.taskId!, task)).then(() => {
      Swal.fire({
        title: '¡Éxito!',
        text: `La tarea "#${this.taskId}" ha sido actualizada con éxito.`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#008686',
        customClass: {
          popup: 'swal-popup',
          confirmButton: 'swal-confirm-btn'
        },
        background: '#101414',
        color: 'white'
      }).then(() => {
        this.router.navigate(['/tasks']);
      });
    }).catch(() => {
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar la tarea. Intenta nuevamente.',
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

  goBackButton(): void {
    this.router.navigate(['/tasks']);
  }
}
