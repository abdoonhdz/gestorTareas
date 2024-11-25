import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'task-column',
  templateUrl: './task-column.component.html',
  styleUrls: ['./task-column.component.css']
})
export class TaskColumnComponent implements OnInit{
  @Input() tasks: Task[] = [];
  @Input() status!: Task['status'];
  @Input() connectedLists: string[] = [];
  @Input() dropListId!: string;

  @Output() taskStatusChanged = new EventEmitter<Task>();

  connectedListsFiltered: string[] = [];


  ngOnInit() {
    this.connectedListsFiltered = this.connectedLists.filter(s => s !== this.status);
    if (!this.tasks) {
      this.tasks = [];
    }
  }

  handleTaskDeleted(taskId: number): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  isNotSubtask(task: Task): boolean {
    return !this.isSubtask(task);
  }

  isSubtask(task: Task): boolean {
    return this.tasks.some(epic => epic.subtasks?.includes(task.id));
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }

  isEpic(task: Task): boolean {
    return task.category.name === "Épica";
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const movedTask = event.previousContainer.data[event.previousIndex];

    if (event.previousContainer === event.container) {
      const visibleTasks = this.tasks.filter(task => this.isNotSubtask(task));
      const previousIndex = visibleTasks.indexOf(movedTask);
      const currentIndex = previousIndex + (event.currentIndex - event.previousIndex);

      moveItemInArray(visibleTasks, previousIndex, currentIndex);
    } else {
      movedTask.status = this.status;

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.taskStatusChanged.emit(movedTask);
    }
  }

}
