import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormControl } from '@angular/forms';
import { Categories } from '../../../categories/models/categories.model';

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
  categories: Categories[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.filteredTasks = tasks;

      const uniqueCategoriesMap = new Map<string, Categories>();
      tasks.forEach(task => {
        if (!uniqueCategoriesMap.has(task.category.id)) {
          uniqueCategoriesMap.set(task.category.id, task.category);
        }
      });
      this.categories = Array.from(uniqueCategoriesMap.values());
    });

    this.taskService.loadTasks();

    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
  }

  applyFilters(): void {
    const selectedCategory = this.categoryControl.value;
    const searchQuery = this.searchControl.value.toLowerCase();

    this.filteredTasks = this.tasks.filter(task => {
      const matchesCategory =
        selectedCategory === 'Todas' || task.category.id === selectedCategory.id;
      const matchesSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery) ||
        task.assignedTo.toLowerCase().includes(searchQuery) ||
        task.priority.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }

  clearFilters(): void {
    this.categoryControl.setValue('Todas', { emitEvent: false });
    this.searchControl.setValue('', { emitEvent: false });
    this.filteredTasks = [...this.tasks];
  }

  trackStatus(index: number, status: string): string {
    return status;
  }
}
