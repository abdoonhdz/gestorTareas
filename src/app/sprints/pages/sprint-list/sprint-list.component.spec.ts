import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SprintListComponent } from './sprint-list.component';
import { SprintsService } from '../../services/sprints.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Sprint } from '../../models/sprint.model';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('SprintListComponent', () => {
  let component: SprintListComponent;
  let fixture: ComponentFixture<SprintListComponent>;
  let mockSprintsService: jasmine.SpyObj<SprintsService>;
  let router: Router;

  const mockSprints: Sprint[] = [
    { id: '1', name: 'Sprint 1', description: 'Description 1', startDate: '2024-12-01', endDate: '2024-12-15', tasks: [1, 2] },
    { id: '2', name: 'Sprint 2', description: 'Description 2', startDate: '2024-12-16', endDate: '2024-12-31', tasks: [3, 4] },
  ];

  beforeEach(async () => {
    const sprintsServiceSpy = jasmine.createSpyObj('SprintsService', ['getSprints']);

    await TestBed.configureTestingModule({
      declarations: [SprintListComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: SprintsService, useValue: sprintsServiceSpy },
      ],
    }).compileComponents();

    mockSprintsService = TestBed.inject(SprintsService) as jasmine.SpyObj<SprintsService>;
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SprintListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load sprints on init', () => {
    // Arrange
    mockSprintsService.getSprints.and.returnValue(of(mockSprints));

    // Act
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(component.sprints.length).toBe(2);
    expect(component.sprints).toEqual(mockSprints);
  });

  it('should navigate to create sprint page', () => {
    // Arrange
    const routerSpy = spyOn(router, 'navigate');

    // Act
    component.createSprint();

    // Assert
    expect(routerSpy).toHaveBeenCalledWith(['/sprints/new']);
  });

  it('should navigate to sprint detail page', () => {
    // Arrange
    const routerSpy = spyOn(router, 'navigate');
    const sprintId = '1';

    // Act
    component.viewSprintDetail(sprintId);

    // Assert
    expect(routerSpy).toHaveBeenCalledWith([`/sprints/${sprintId}`]);
  });

  it('should call loadSprints and set sprints', () => {
    // Arrange
    mockSprintsService.getSprints.and.returnValue(of(mockSprints));

    // Act
    component.loadSprints();

    // Assert
    expect(mockSprintsService.getSprints).toHaveBeenCalled();
    expect(component.sprints).toEqual(mockSprints);
  });
});
