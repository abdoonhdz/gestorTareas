import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { CategoriesService } from '../../../categories/services/categories.service';
import { Categories } from '../../../categories/models/categories.model';

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


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
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
    });
  }

  ngOnInit(): void {
    if (this.taskId) {
      this.loadTask();
    }
    this.loadCategories();
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
    });
  }

  compareCategories(c1: Categories, c2: Categories): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.taskId) {
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
