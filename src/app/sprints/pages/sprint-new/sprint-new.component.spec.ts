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

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    const formValue = component.sprintForm.value;
    expect(formValue).toEqual({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      tasks: []
    });
  });

  // it('should load available tasks excluding subtasks', () => {
  //   expect(component.availableTasks.length).toBe(2);
  //   expect(component.availableTasks[0].id).toBe(2);
  //   expect(component.availableTasks[1].id).toBe(3);
  // });


  it('should mark the form as invalid if required fields are empty', () => {
    component.sprintForm.controls['name'].setValue('');
    component.sprintForm.controls['description'].setValue('');
    component.sprintForm.controls['startDate'].setValue('');
    component.sprintForm.controls['endDate'].setValue('');
    expect(component.sprintForm.invalid).toBeTrue();
  });

  it('should call sprintsService.createSprint on valid form submission', () => {
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

  it('should not call sprintsService.createSprint if form is invalid', () => {
    component.sprintForm.controls['name'].setValue('');
    component.onSubmit();
    expect(sprintsServiceSpy.createSprint).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back when goBackButton is called', () => {
    component.goBackButton();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sprints']);
  });

  it('should display an error when description is less than 20 characters', () => {
    component.sprintForm.controls['description'].setValue('Short desc');
    fixture.detectChanges();

    const descriptionInput = fixture.debugElement.query(By.css('input[formControlName="description"]'));
    expect(descriptionInput).toBeTruthy();
    expect(component.sprintForm.controls['description'].invalid).toBeTrue();
  });
});
