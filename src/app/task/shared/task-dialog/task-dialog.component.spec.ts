import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskDetailsDialogComponent } from './task-dialog.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Categories } from '../../../categories/models/categories.model';

const mockCategory: Categories = { id: "1", name: 'Categoría 1' };
const mockTask: Task = {
  id: 1,
  title: 'Tarea de prueba',
  assignedTo: 'Usuario 1',
  priority: 'media',
  category: mockCategory,
  status: 'pendiente',
  estimatedTime: '2h',
  description: 'Descripción de prueba',
  subtasks: [2, 3]
};

const mockTasks: Task[] = [
  mockTask,
  {
    id: 2,
    title: 'Subtarea 1',
    assignedTo: 'Usuario 2',
    priority: 'baja',
    category: mockCategory,
    status: 'en progreso',
    estimatedTime: '1h',
    description: 'Descripción de subtarea 1'
  },
  {
    id: 3,
    title: 'Subtarea 2',
    assignedTo: 'Usuario 3',
    priority: 'alta',
    category: mockCategory,
    status: 'completada',
    estimatedTime: '3h',
    description: 'Descripción de subtarea 2'
  }
];

describe('TaskDetailsDialogComponent', () => {
  let component: TaskDetailsDialogComponent;
  let fixture: ComponentFixture<TaskDetailsDialogComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getAllTasks']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TaskDetailsDialogComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { task: mockTask, action: 'view' } },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailsDialogComponent);
    component = fixture.componentInstance;
    taskServiceSpy.getAllTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las subtareas en la inicialización si existen', () => {
    expect(component.subtasksIds).toEqual([2, 3]);
    expect(component.subtasks.length).toBe(2);
    expect(component.subtasks[0].title).toBe('Subtarea 1');
  });

  it('debería cerrar el diálogo al llamar a closeDialog()', () => {
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('debería cerrar el diálogo con acción al llamar a confirmAction()', () => {
    component.confirmAction();
    expect(component.dialogRef.close).toHaveBeenCalledWith({ action: 'view', task: mockTask });
  });

  it('debería navegar a la página de edición al llamar a editAction()', () => {
    component.editAction();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks', 'edit', 1]);
  });

  it('debería abrir un nuevo diálogo con los detalles de la tarea al llamar a showTaskDetails()', () => {
    const dialogSpy = spyOn(component.dialog, 'open').and.callThrough();
    component.showTaskDetails(mockTask);

    expect(dialogSpy).toHaveBeenCalled();

    const dialogArgs = dialogSpy.calls.mostRecent().args[1] as { data: { task: Task } };

    if (dialogArgs?.data?.task) {
      expect(dialogArgs.data.task.title).toBe('Tarea de prueba');
    } else {
      fail('Los argumentos del diálogo o los datos de la tarea están ausentes');
    }
  });

});
