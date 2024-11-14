export interface Task {
  id: number;
  title: string;
  assignedTo: string;
  priority: 'baja' | 'media' | 'alta';
  category: string;
  status: 'pendiente' | 'en progreso' | 'en pruebas' | 'completada';
  estimatedTime: string;
  description: string;
}
