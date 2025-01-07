import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormGenericComponent } from './task-form-generic.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { CategoriesService } from '../../../categories/services/categories.service';
import { UsersService } from '../../../users/services/users.service';
import { Task } from '../../models/task.model';
import { Categories } from '../../../categories/models/categories.model';
import { User } from '../../../users/models/user.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import Swal from 'sweetalert2';
import { SweetAlertResult } from 'sweetalert2';
import { MaterialModule } from '../../../material/material.module';
import { AppModule } from '../../../app.module';

describe('TaskFormGenericComponent', () => {
  let component: TaskFormGenericComponent;
  let fixture: ComponentFixture<TaskFormGenericComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let categoriesServiceSpy: jasmine.SpyObj<CategoriesService>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks', 'getTaskById', 'createTask', 'updateTask', 'getTasksByIds']);
    categoriesServiceSpy = jasmine.createSpyObj('CategoriesService', ['getCategories']);
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    categoriesServiceSpy.getCategories.and.returnValue(of([]));
    taskServiceSpy.getTasks.and.returnValue(of([]));
    usersServiceSpy.getUsers.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [TaskFormGenericComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, MaterialModule, AppModule],
      providers: [
        FormBuilder,
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CategoriesService, useValue: categoriesServiceSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario y cargar categorías, tareas y usuarios al inicializar', () => {
    const mockCategories: Categories[] = [
      { id: '1', name: 'Feature' },
      { id: '2', name: 'Bug' },
    ];

    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', status: 'pendiente', assignedTo: 'User 1', category: mockCategories[0], priority: 'baja', estimatedTime: '', description: '', subtasks: [] },
    ];

    const mockUsers: User[] = [
      { id: '1', name: 'User 1', username: 'user1', email: 'user1@example.com', password: 'password1', role: { id: '1', name: 'Admin' } },
      { id: '2', name: 'User 2', username: 'user2', email: 'user2@example.com', password: 'password2', role: { id: '2', name: 'User' } },
    ];

    categoriesServiceSpy.getCategories.and.returnValue(of(mockCategories));
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
    usersServiceSpy.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.categories).toEqual(mockCategories);
    expect(component.availableTasks).toEqual(mockTasks);
    expect(component.users).toEqual(mockUsers);
  });

  it('debería llamar a createTask al enviar un formulario válido', () => {
    spyOn(Swal, 'fire').and.callFake(() =>
      Promise.resolve({
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
        value: null,
      } as SweetAlertResult<any>)
    );

    const mockTask: Task = {
      id: 1,
      title: 'New Task',
      status: 'pendiente',
      assignedTo: 'User 1',
      category: { id: '1', name: 'Feature' },
      priority: 'baja',
      estimatedTime: '02:00',
      description: 'A new task description',
      subtasks: [],
    };

    component.taskForm.setValue({
      title: mockTask.title,
      assignedTo: mockTask.assignedTo,
      priority: mockTask.priority,
      category: mockTask.category,
      status: mockTask.status,
      estimatedTime: mockTask.estimatedTime,
      description: mockTask.description,
      subtasks: mockTask.subtasks,
    });

    taskServiceSpy.createTask.and.returnValue(of(mockTask));

    component.onSubmit();
    fixture.detectChanges();

    const expectedTask = { ...component.taskForm.value };

    expect(taskServiceSpy.createTask).toHaveBeenCalledWith(expectedTask);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
    expect(component.taskForm.valid).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('debería cargar una tarea por ID cuando se proporciona taskId', () => {
    component.taskId = '1';

    const mockTask: Task = {
      id: 1,
      title: 'Task 1',
      status: 'pendiente',
      assignedTo: 'User 1',
      category: { id: '1', name: 'Feature' },
      priority: 'baja',
      estimatedTime: '01:30',
      description: 'Task description',
      subtasks: [],
    };

    taskServiceSpy.getTaskById.and.returnValue(of(mockTask));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.task).toEqual(mockTask);
    expect(component.taskForm.value.title).toBe(mockTask.title);
  });

  it('debería navegar hacia atrás cuando se haga clic en goBackButton', () => {
    component.goBackButton();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
