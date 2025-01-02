import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { TaskService } from '../../services/task.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDetailsDialogComponent } from '../task-dialog/task-dialog.component';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.model';
import { EventEmitter } from '@angular/core';
import { AppModule } from '../../../app.module';
import { MaterialModule } from '../../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    assignedTo: 'John Doe',
    priority: 'alta',
    category: { id: '1', name: 'Development' },
    status: 'pendiente',
    estimatedTime: '2h',
    description: 'Task for testing purposes'
  };

  beforeEach(async () => {
    const taskServiceMock = jasmine.createSpyObj('TaskService', ['deleteTask']);
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TaskCardComponent],
      imports: [AppModule, MaterialModule, TranslateModule.forRoot()],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    component.task = mockTask;
  });

  describe('showTaskDetails', () => {
    it('should open the task details dialog with correct data', () => {
      const mockDialogRef = { afterClosed: () => of({ action: 'edit', task: mockTask }) };
      dialogSpy.open.and.returnValue(mockDialogRef as MatDialogRef<TaskDetailsDialogComponent>);

      const consoleSpy = spyOn(console, 'log');

      component.showTaskDetails(mockTask);

      expect(dialogSpy.open).toHaveBeenCalledWith(TaskDetailsDialogComponent, {
        width: '100%',
        maxWidth: '600px',
        height: 'auto',
        minHeight: '400px',
        data: { task: mockTask, action: 'view' }
      });

      expect(consoleSpy).toHaveBeenCalledWith('Editar tarea:', mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should call deleteTask and emit taskDeleted on success', () => {
      const mockDialogRef = { afterClosed: () => of({ action: 'delete' }) };
      dialogSpy.open.and.returnValue(mockDialogRef as MatDialogRef<TaskDetailsDialogComponent>);
      taskServiceSpy.deleteTask.and.returnValue(of(undefined));

      const taskDeletedSpy = spyOn(component.taskDeleted, 'emit');

      component.deleteTask(mockTask.id, mockTask);

      expect(dialogSpy.open).toHaveBeenCalledWith(TaskDetailsDialogComponent, {
        width: '100%',
        maxWidth: '600px',
        height: 'auto',
        minHeight: '400px',
        data: { task: mockTask, action: 'delete' }
      });

      expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTask.id);
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Tarea eliminada con éxito',
        'Cerrar',
        jasmine.objectContaining({ duration: 2000, panelClass: ['success-snackbar'] })
      );
      expect(taskDeletedSpy).toHaveBeenCalledWith(mockTask.id);
    });

    it('should show an error message if deleteTask fails', () => {
      const mockDialogRef = { afterClosed: () => of({ action: 'delete' }) };
      dialogSpy.open.and.returnValue(mockDialogRef as MatDialogRef<TaskDetailsDialogComponent>);
      taskServiceSpy.deleteTask.and.returnValue(throwError(() => new Error('Error al eliminar')));

      const taskDeletedSpy = spyOn(component.taskDeleted, 'emit');

      component.deleteTask(mockTask.id, mockTask);

      expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTask.id);
      expect(snackBarSpy.open).toHaveBeenCalledWith(
        'Hubo un error al eliminar la tarea',
        'Cerrar',
        jasmine.objectContaining({ duration: 2000, panelClass: ['error-snackbar'] })
      );
      expect(taskDeletedSpy).not.toHaveBeenCalled();
    });

    it('should do nothing if dialog is closed without confirming delete', () => {
      const mockDialogRef = { afterClosed: () => of(null) };
      dialogSpy.open.and.returnValue(mockDialogRef as MatDialogRef<TaskDetailsDialogComponent>);

      const taskDeletedSpy = spyOn(component.taskDeleted, 'emit');

      component.deleteTask(mockTask.id, mockTask);

      expect(taskServiceSpy.deleteTask).not.toHaveBeenCalled();
      expect(snackBarSpy.open).not.toHaveBeenCalled();
      expect(taskDeletedSpy).not.toHaveBeenCalled();
    });
  });
});
