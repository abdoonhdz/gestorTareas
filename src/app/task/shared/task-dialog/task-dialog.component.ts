import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'task-details-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDetailsDialogComponent implements OnInit {
  action: string;
  epicTitle: string = '';
  selectedTasks: Task[] = [];
  subtasksIds: number[] = [];
  subtasks: Task[] = [];

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task; tasks?: Task[]; action: string },
    private router: Router,
    private taskService: TaskService,
    public dialog: MatDialog
  ) {
    this.action = data.action;
  }

  ngOnInit(): void {
    if (this.data.task?.subtasks && this.data.task.subtasks.length > 0) {
      this.subtasksIds = this.data.task.subtasks.map(subtaskId => subtaskId);
      this.loadSubtasks();
    }
  }

  loadSubtasks(): void {
    this.taskService.getAllTasks().subscribe(tasks => {
      this.subtasks = tasks.filter(task => this.subtasksIds.includes(task.id));
      console.log('Subtareas:', this.subtasks);
    });
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmAction(): void {
    this.dialogRef.close({ action: this.action, task: this.data.task });
  }

  editAction(): void {
    this.router.navigate(['/tasks', 'edit', this.data.task!.id]);
    this.dialog.closeAll();
  }

  showTaskDetails(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailsDialogComponent, {
      width: '100%',
      maxWidth: '800px',
      height: 'auto',
      minHeight: '500px',
      data: { task, action: 'view' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'edit') {
        console.log('Editar tarea:', result.task);
      }
    });
  }
}
