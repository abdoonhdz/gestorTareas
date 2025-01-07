import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprintNewComponent } from './sprint-new.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SprintsService } from '../../services/sprints.service';
import { TaskService } from '../../../task/services/task.service';
import { Task } from '../../../task/models/task.model';
import { Sprint } from '../../models/sprint.model';
import { By } from '@angular/platform-browser';
import { AppModule } from '../../../app.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../material/material.module';

describe('SprintNewComponent', () => {
  let component: SprintNewComponent;
  let fixture: ComponentFixture<SprintNewComponent>;
  let sprintsServiceSpy: jasmine.SpyObj<SprintsService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', status: 'pendiente', category: { id: '1', name: 'Feature' }, assignedTo: 'User 1', priority: 'baja', description: '', estimatedTime: '', subtasks: [3, 4] },
    { id: 2, title: 'Task 2', status: 'pendiente', category: { id: '2', name: 'Bug' }, assignedTo: 'User 2', priority: 'media', description: '', estimatedTime: '', subtasks: [] },
    { id: 3, title: 'Task 3', status: 'completada', category: { id: '1', name: 'Feature' }, assignedTo: 'User 3', priority: 'alta', description: '', estimatedTime: '', subtasks: [] }
  ];

  const mockSprint: Sprint = {
    id: '12345',
    name: 'Sprint 1',
    description: 'This is a description with more than 20 characters.',
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    tasks: [2]
  };

  beforeEach(async () => {
    sprintsServiceSpy = jasmine.createSpyObj('SprintsService', ['createSprint']);
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [SprintNewComponent],
      imports: [ReactiveFormsModule, MaterialModule, TranslateModule.forRoot(), AppModule],
      providers: [
        FormBuilder,
        { provide: SprintsService, useValue: sprintsServiceSpy },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintNewComponent);
    component = fixture.componentInstance;

    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores vacíos', () => {
    const formValue = component.sprintForm.value;
    expect(formValue).toEqual({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      tasks: []
    });
  });

  it('debería cargar las tareas disponibles excluyendo subtareas', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Task 1', status: 'pendiente', category: { id: '1', name: 'Feature' }, assignedTo: 'User 1', priority: 'baja', description: '', estimatedTime: '', subtasks: [3, 4] },
      { id: 2, title: 'Task 2', status: 'pendiente', category: { id: '2', name: 'Bug' }, assignedTo: 'User 2', priority: 'media', description: '', estimatedTime: '', subtasks: [] },
      { id: 3, title: 'Task 3', status: 'completada', category: { id: '1', name: 'Feature' }, assignedTo: 'User 3', priority: 'alta', description: '', estimatedTime: '', subtasks: [] },
      { id: 4, title: 'Task 4', status: 'en progreso', category: { id: '2', name: 'Bug' }, assignedTo: 'User 4', priority: 'baja', description: '', estimatedTime: '', subtasks: [] },
    ];

    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();
    fixture.detectChanges();

    const filteredTaskIds = component.availableTasks.map(task => task.id);
    const expectedTaskIds = [2, 3, 4];

    expect(filteredTaskIds).toEqual(expectedTaskIds);
    expect(component.availableTasks.length).toBe(expectedTaskIds.length);
  });

  it('debería marcar el formulario como inválido si los campos requeridos están vacíos', () => {
    component.sprintForm.controls['name'].setValue('');
    component.sprintForm.controls['description'].setValue('');
    component.sprintForm.controls['startDate'].setValue('');
    component.sprintForm.controls['endDate'].setValue('');
    expect(component.sprintForm.invalid).toBeTrue();
  });

  it('debería llamar a sprintsService.createSprint al enviar un formulario válido', () => {
    component.sprintForm.setValue({
      name: mockSprint.name,
      description: mockSprint.description,
      startDate: mockSprint.startDate,
      endDate: mockSprint.endDate,
      tasks: mockSprint.tasks
    });

    sprintsServiceSpy.createSprint.and.returnValue(of(mockSprint));

    component.onSubmit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sprints']);
  });

  it('no debería llamar a sprintsService.createSprint si el formulario es inválido', () => {
    component.sprintForm.controls['name'].setValue('');
    component.onSubmit();
    expect(sprintsServiceSpy.createSprint).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('debería navegar hacia atrás cuando se llame a goBackButton', () => {
    component.goBackButton();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sprints']);
  });
});
