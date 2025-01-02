import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TaskDetailComponent } from './task-detail.component';
import { of } from 'rxjs';
import { AppModule } from '../../../app.module';
import { TranslateModule } from '@ngx-translate/core';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let activatedRouteStub: any;

  beforeEach(() => {
    activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'mock-task-id'
        }
      }
    };

    TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      imports: [AppModule, TranslateModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set taskId from route parameter', () => {
      expect(component.taskId).toBe('mock-task-id');
    });
  });
});
