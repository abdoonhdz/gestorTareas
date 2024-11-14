import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsDialogComponent } from '../task-dialog/task-dialog.component';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  @Input() task!: Task;
  @Output() taskDeleted = new EventEmitter<number>();


  showTaskDetails(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      minHeight: '400px',
      data: { task, action: 'view' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'edit') {
        console.log('Editar tarea:', result.task);
      }
    });
  }

  deleteTask(taskId: number, task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      minHeight: '400px',
      data: { task, action: 'delete' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            this.snackBar.open('Tarea eliminada con éxito', 'Cerrar', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
            this.taskDeleted.emit(taskId);
          },
          error: (err) => {
            console.error('Error al eliminar la tarea:', err);
            this.snackBar.open('Hubo un error al eliminar la tarea', 'Cerrar', {
              duration: 2000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}
