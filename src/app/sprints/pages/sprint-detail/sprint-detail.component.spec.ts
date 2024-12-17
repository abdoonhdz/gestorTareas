// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SprintDetailComponent } from './sprint-detail.component';
// import { ActivatedRoute } from '@angular/router';
// import { of, throwError } from 'rxjs';
// import { SprintsService } from '../../services/sprints.service';
// import { TaskService } from '../../../task/services/task.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { Sprint } from '../../models/sprint.model';
// import { Task } from '../../../task/models/task.model';
// import { AppModule } from '../../../app.module';
// import { TranslateModule } from '@ngx-translate/core';

// describe('SprintDetailComponent', () => {
//   let component: SprintDetailComponent;
//   let fixture: ComponentFixture<SprintDetailComponent>;
//   let sprintsServiceSpy: jasmine.SpyObj<SprintsService>;
//   let taskServiceSpy: jasmine.SpyObj<TaskService>;
//   let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
//   let routerSpy: jasmine.SpyObj<Router>;

//   beforeEach(async () => {
//     sprintsServiceSpy = jasmine.createSpyObj('SprintsService', ['getSprintById', 'deleteSprint']);
//     taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks']);
//     snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
//     routerSpy = jasmine.createSpyObj('Router', ['navigate']);

//     const routeStub = {
//       snapshot: {
//         paramMap: jasmine.createSpyObj('paramMap', ['get']),
//       }
//     };

//     routeStub.snapshot.paramMap.get.and.returnValue('1');

//     await TestBed.configureTestingModule({
//       declarations: [SprintDetailComponent],
//       imports: [AppModule, TranslateModule.forRoot()],
//       providers: [
//         { provide: SprintsService, useValue: sprintsServiceSpy },
//         { provide: TaskService, useValue: taskServiceSpy },
//         { provide: MatSnackBar, useValue: snackBarSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: ActivatedRoute, useValue: routeStub }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SprintDetailComponent);
//     component = fixture.componentInstance;

//     sprintsServiceSpy.getSprintById.and.returnValue(of({
//       id: 1,
//       name: 'Sprint 1',
//       tasks: [1, 2],
//       description: 'Sprint for development',
//       startDate: '2024-01-01',
//       endDate: '2024-12-31'
//     } as unknown as Sprint));

//     taskServiceSpy.getTasks.and.returnValue(of([{ id: 1, title: 'Task 1' }, { id: 2, title: 'Task 2' }] as Task[]));

//     fixture.detectChanges();
//   });
// });
