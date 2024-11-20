import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'task-column',
  templateUrl: './task-column.component.html',
  styleUrls: ['./task-column.component.css']
})
export class TaskColumnComponent {
  @Input() tasks: Task[] = [];
  @Input() status!: Task['status'];

  handleTaskDeleted(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  shouldDisplayTask(task: Task): boolean {
    for (let t of this.tasks) {
      if (t.subtasks && t.subtasks.includes(task.id)) {
        return false;
      }
    }
    return true;
  }
}
