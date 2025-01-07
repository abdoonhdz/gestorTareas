import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { SprintDetailComponent } from './sprint-detail.component';
import { SprintsService } from '../../services/sprints.service';
import { TaskService } from '../../../task/services/task.service';
import { Sprint } from '../../models/sprint.model';
import { Task } from '../../../task/models/task.model';

describe('SprintDetailComponent', () => {
  let component: SprintDetailComponent;
  let fixture: ComponentFixture<SprintDetailComponent>;
  let sprintsServiceSpy: jasmine.SpyObj<SprintsService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    const sprintsServiceMock = jasmine.createSpyObj('SprintsService', ['getSprintById', 'deleteSprint']);
    const taskServiceMock = jasmine.createSpyObj('TaskService', ['getTasks']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => '1',
          getAll: (key: string) => [],
          has: (key: string) => true,
          keys: [],
        },
        url: [],
        params: {},
        queryParams: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        routeConfig: null,
        root: {} as ActivatedRouteSnapshot,
        parent: null,
        firstChild: null,
        children: [],
        title: undefined,
        pathFromRoot: [] as ActivatedRouteSnapshot[],
        queryParamMap: {
          get: () => null,
          getAll: () => [],
          has: () => false,
          keys: [],
        },
        component: null
      },
    };


    await TestBed.configureTestingModule({
      declarations: [SprintDetailComponent],
      providers: [
        { provide: SprintsService, useValue: sprintsServiceMock },
        { provide: TaskService, useValue: taskServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    sprintsServiceSpy = TestBed.inject(SprintsService) as jasmine.SpyObj<SprintsService>;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(SprintDetailComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería obtener el sprint y las tareas en ngOnInit', () => {
    const sprintMock: Sprint = { id: "1", name: 'Sprint 1', tasks: [1, 2], startDate: '', endDate: '', description: '' };
    const tasksMock: Task[] = [
      { id: 1, title: 'Task 1', status: 'pendiente', assignedTo: '', category: { id: "1", name: 'Development' }, priority: 'baja', estimatedTime: '', description: '' },
      { id: 2, title: 'Task 2', status: 'en progreso', assignedTo: '', category: { id: "2", name: 'Testing' }, priority: 'media', estimatedTime: '', description: '' },
    ];

    sprintsServiceSpy.getSprintById.and.returnValue(of(sprintMock));
    taskServiceSpy.getTasks.and.returnValue(of(tasksMock));

    component.ngOnInit();

    expect(sprintsServiceSpy.getSprintById).toHaveBeenCalledWith('1');
    expect(taskServiceSpy.getTasks).toHaveBeenCalled();
    expect(component.sprint).toEqual(sprintMock);
    expect(component.tasks).toEqual(tasksMock);
  });

  it('debería manejar la eliminación del sprint correctamente', () => {
    sprintsServiceSpy.deleteSprint.and.returnValue(of(undefined));
    component.deleteSprint();

    expect(sprintsServiceSpy.deleteSprint).toHaveBeenCalledWith('1');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Sprint eliminado con éxito', 'Cerrar', { duration: 3000 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sprints']);
  });

  it('debería manejar el error al eliminar el sprint', () => {
    sprintsServiceSpy.deleteSprint.and.returnValue(throwError(() => new Error('Error al eliminar')));
    component.deleteSprint();

    expect(sprintsServiceSpy.deleteSprint).toHaveBeenCalledWith('1');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Error al eliminar el sprint', 'Cerrar', { duration: 3000 });
  });

  it('debería navegar hacia atrás cuando se hace clic en el botón de retroceso', () => {
    component.goBackButton();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sprints']);
  });
});
