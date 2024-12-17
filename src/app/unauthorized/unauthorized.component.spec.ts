import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UnauthorizedComponent } from './unauthorized.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnauthorizedComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /tasks when goBack is called', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
