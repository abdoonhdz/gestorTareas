import { Categories } from '../../categories/models/categories.model';

export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  priority: 'baja' | 'media' | 'alta';
  category: Categories;
  status: 'pendiente' | 'en progreso' | 'en pruebas' | 'completada';
  estimatedTime: string;
  description: string;
  subtasks?: number[];
}
