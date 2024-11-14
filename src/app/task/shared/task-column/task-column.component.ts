import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'task-column',
  templateUrl: './task-column.component.html',
  styleUrls: ['./task-column.component.css']
})
export class TaskColumnComponent {
  @Input() title: string = '';
  @Input() tasks: Task[] = [];
  @Input() status!: Task['status'];
  @Output() taskDeleted = new EventEmitter<number>();

  onDeleteTask(taskId: number) {
    this.taskDeleted.emit(taskId);
  }

  trackById(index: number, task: Task): number {
    return task.id;
  }

  handleTaskDeleted(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }
}
