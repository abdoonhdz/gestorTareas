import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppModule } from '../../../app.module';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceStub: any;
  let storeStub: any;

  beforeEach(() => {
    taskServiceStub = {
      tasks$: of([]),
      loadTasks: jasmine.createSpy('loadTasks'),
      updateTask: jasmine.createSpy('updateTask').and.returnValue(of(true))
    };

    storeStub = {
      dispatch: jasmine.createSpy('dispatch')
    };

    TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), AppModule],
      providers: [
        { provide: TaskService, useValue: taskServiceStub },
        { provide: Store, useValue: storeStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('updateTask', () => {
    it('should call updateTask on TaskService with correct arguments', () => {
      const task = { id: 1, title: 'Test Task' } as any;
      component.updateTask(task);
      expect(taskServiceStub.updateTask).toHaveBeenCalledWith('1', task);
    });
  });

  describe('trackStatus', () => {
    it('should return the status as a string', () => {
      const status = 'pendiente';
      const result = component.trackStatus(0, status);
      expect(result).toBe(status);
    });
  });

  describe('getTasksByStatus', () => {
    it('should return tasks filtered by status', () => {
      const status = 'completada';
      const filteredTasks = component.getTasksByStatus(status);
      expect(filteredTasks).toEqual(component.tasks.filter(task => task.status === status));
    });
  });

  describe('clearFilters', () => {
    it('should reset filters to default values', () => {
      component.categoryControl.setValue('Progreso');
      component.searchControl.setValue('Test');
      component.clearFilters();
      expect(component.categoryControl.value).toBe('Todas');
      expect(component.searchControl.value).toBe('');
    });
  });
});
