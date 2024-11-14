import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  taskStatuses: Task['status'][] = ['pendiente', 'en progreso', 'en pruebas', 'completada'];
  categoryControl: FormControl = new FormControl('Todas');
  searchControl: FormControl = new FormControl('');
  categories: string[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;
      this.categories = Array.from(new Set(tasks.map(task => task.category)));
    });

    this.taskService.loadTasks();

    this.categoryControl.valueChanges.subscribe((selectedCategory) => {
      this.filterTasksByCategory(selectedCategory);
    });

    this.searchControl.valueChanges.subscribe((query) => {
      this.onSearch(query);
    });
  }

  filterTasksByCategory(selectedCategory: string): void {
    if (selectedCategory === 'Todas') {
      this.filteredTasks = this.tasks;
    } else if (selectedCategory) {
      this.filteredTasks = this.tasks.filter(task => task.category === selectedCategory);
    }
  }

  onSearch(event: Event): void {
    const input = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredTasks = this.tasks.filter((task) =>
      task.title.toLowerCase().includes(input) ||
      task.assignedTo.toLowerCase().includes(input) ||
      task.priority.toLowerCase().includes(input)
    );
  }

  clearFilters(): void {
    this.categoryControl.setValue('Todas');
    this.searchControl.setValue('');
    this.filteredTasks = [...this.tasks];
  }

  trackStatus(index: number, status: string): string {
    return status;
  }
}
