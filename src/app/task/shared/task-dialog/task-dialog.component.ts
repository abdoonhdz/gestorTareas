import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'task-details-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDetailsDialogComponent {

  action: string;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, action: string },
    private router: Router,
  ) {
    this.action = data.action;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  confirmAction(): void {
    this.dialogRef.close({ action: this.action, task: this.data.task });
  }

  editAction() {
    this.router.navigate(['/tasks', 'edit', this.data.task.id]);
    this.dialogRef.close();
  }

}
