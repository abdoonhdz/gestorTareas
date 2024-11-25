import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task.model';


@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: Task[], searchQuery: string, selectedCategory: any): Task[] {
    if (!tasks) return [];

    return tasks.filter(task => {
      const matchesCategory =
        selectedCategory === 'Todas' || task.category.id === selectedCategory.id;
      const matchesSearch =
        !searchQuery ||
        task.title?.toLowerCase().includes(searchQuery) ||
        task.assignedTo?.toLowerCase().includes(searchQuery) ||
        task.priority?.toLowerCase().includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }
}
