import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { FormControl } from '@angular/forms';
import { Categories } from '../../../categories/models/categories.model';
import { TranslateService } from '@ngx-translate/core';

import { updateTask } from '../../task-store/task.actions';
import { Store } from '@ngrx/store';
import { selectAllTasks } from '../../task-store/task.selectors';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  taskStatuses: Task['status'][] = ['pendiente', 'en progreso', 'en pruebas', 'completada'];
  categoryControl: FormControl = new FormControl('Todas');
  searchControl: FormControl = new FormControl('');
  categories: Categories[] = [];
  selectedLanguage: string = '';


  constructor(
    private taskService: TaskService,
    private translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private store: Store
)
     {
    const browserLang = this.translate.getBrowserLang();
    this.selectedLanguage = browserLang || 'es';
    this.translate.use(this.selectedLanguage);
  }

  ngOnInit(): void {
    this.taskService.tasks$.subscribe((tasks: Task[]) => {
      this.tasks = tasks;

      const uniqueCategoriesMap = new Map<string, Categories>();
      tasks.forEach(task => {
        if (!uniqueCategoriesMap.has(task.category.id)) {
          uniqueCategoriesMap.set(task.category.id, task.category);
        }
      });
      this.categories = Array.from(uniqueCategoriesMap.values());
    });

    this.taskService.loadTasks();
  }

  clearFilters(): void {
    this.categoryControl.setValue('Todas', { emitEvent: false });
    this.searchControl.setValue('', { emitEvent: false });
  }

  getTasksByStatus(status: Task['status']): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  trackStatus(index: number, status: string): string {
    return status;
  }

  updateTask(task: Task): void {
    this.taskService.updateTask(task.id.toString(), task).subscribe(() => {
    });
  }


}
