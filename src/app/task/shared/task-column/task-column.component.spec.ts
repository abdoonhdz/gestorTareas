import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskColumnComponent } from './task-column.component';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from '../../models/task.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TaskColumnComponent', () => {
  let component: TaskColumnComponent;
  let fixture: ComponentFixture<TaskColumnComponent>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', status: 'pendiente', category: { id: '1', name: 'General' }, description: '', priority: 'media', assignedTo: 'User1', estimatedTime: '2h' },
    { id: 2, title: 'Task 2', status: 'pendiente', category: { id: '2', name: 'Épica' }, description: '', priority: 'alta', assignedTo: 'User2', estimatedTime: '4h', subtasks: [3] },
    { id: 3, title: 'Task 3', status: 'pendiente', category: { id: '1', name: 'General' }, description: '', priority: 'baja', assignedTo: 'User3', estimatedTime: '1h' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskColumnComponent],
      imports: [DragDropModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskColumnComponent);
    component = fixture.componentInstance;
    component.tasks = [...mockTasks];
    component.status = 'pendiente';
    component.connectedLists = ['pendiente', 'en progreso', 'en pruebas', 'completada'];
    component.dropListId = 'pendingList';
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('#handleTaskDeleted', () => {
    it('debería eliminar una tarea por ID', () => {
      component.handleTaskDeleted(1);
      expect(component.tasks.some(task => task.id === 1)).toBeFalse();
    });

    it('no debería eliminar ninguna tarea si el ID no se encuentra', () => {
      component.handleTaskDeleted(99);
      expect(component.tasks.length).toBe(3);
    });
  });

  describe('#isNotSubtask', () => {
    it('debería devolver verdadero para tareas que no son subtareas', () => {
      expect(component.isNotSubtask(mockTasks[0])).toBeTrue();
    });

    it('debería devolver falso para tareas que son subtareas', () => {
      expect(component.isNotSubtask(mockTasks[2])).toBeFalse();
    });
  });

  describe('#isSubtask', () => {
    it('debería devolver verdadero si la tarea es una subtarea', () => {
      expect(component.isSubtask(mockTasks[2])).toBeTrue();
    });

    it('debería devolver falso si la tarea no es una subtarea', () => {
      expect(component.isSubtask(mockTasks[0])).toBeFalse();
    });
  });

  describe('#trackByTaskId', () => {
    it('debería devolver el ID de la tarea', () => {
      expect(component.trackByTaskId(0, mockTasks[0])).toBe(1);
    });
  });

  describe('#isEpic', () => {
    it('debería devolver verdadero si la tarea es una épica', () => {
      expect(component.isEpic(mockTasks[1])).toBeTrue();
    });

    it('debería devolver falso si la tarea no es una épica', () => {
      expect(component.isEpic(mockTasks[0])).toBeFalse();
    });
  });

  describe('#onDrop', () => {
    it('debería reordenar las tareas dentro del mismo contenedor', () => {
      const event = {
        previousContainer: { data: component.tasks, id: 'pendingList' },
        container: { data: component.tasks, id: 'pendingList' },
        previousIndex: 0,
        currentIndex: 2,
      } as unknown as CdkDragDrop<Task[]>;

      component.onDrop(event);
      expect(component.tasks[0].id).toBe(2);
      expect(component.tasks[1].id).toBe(3);
      expect(component.tasks[2].id).toBe(1);
    });

    it('debería transferir una tarea a un contenedor diferente', () => {
      const otherTasks: Task[] = [];
      const event = {
        previousContainer: { data: component.tasks, id: 'pendingList' },
        container: { data: otherTasks, id: 'inProgressList' },
        previousIndex: 0,
        currentIndex: 0,
      } as unknown as CdkDragDrop<Task[]>;

      component.onDrop(event);
      expect(component.tasks.length).toBe(2);
      expect(otherTasks.length).toBe(1);
      expect(otherTasks[0].status).toBe('pendiente');
    });
  });
});
