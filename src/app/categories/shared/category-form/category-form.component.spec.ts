import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { of } from 'rxjs';
import { Categories } from '../../models/categories.model';

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let categoriesServiceSpy: jasmine.SpyObj<CategoriesService>;

  const mockCategories: Categories[] = [
    { id: '1', name: 'Work' },
    { id: '2', name: 'Personal' }
  ];

  beforeEach(async () => {
    const categoriesServiceMock = jasmine.createSpyObj('CategoriesService', ['loadCategories', 'createCategory', 'deleteCategory'], ['categories$']);

    await TestBed.configureTestingModule({
      declarations: [CategoryFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CategoriesService, useValue: categoriesServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    categoriesServiceSpy = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;

    Object.defineProperty(categoriesServiceSpy, 'categories$', { get: () => of(mockCategories) });
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con validadores', () => {
    const form = component.categoryForm;
    expect(form).toBeDefined();
    expect(form.get('name')?.valid).toBeFalse();

    form.get('name')?.setValue('Work');
    expect(form.valid).toBeTrue();
  });

  it('debería cargar las categorías al inicializar', () => {
    component.ngOnInit();
    expect(categoriesServiceSpy.loadCategories).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
  });

  it('debería llamar a createCategory al enviar un formulario válido', () => {
    categoriesServiceSpy.createCategory.and.returnValue(of({ id: '3', name: 'New Category' }));
    categoriesServiceSpy.loadCategories.and.callThrough();

    component.categoryForm.setValue({
      name: 'New Category'
    });

    component.createCategory();

    expect(categoriesServiceSpy.createCategory).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'New Category'
    }));
    expect(categoriesServiceSpy.loadCategories).toHaveBeenCalled();
    expect(['', null]).toContain(component.categoryForm.get('name')?.value);
  });

  it('no debería llamar a createCategory al enviar un formulario inválido', () => {
    component.categoryForm.setValue({
      name: ''
    });

    component.createCategory();

    expect(categoriesServiceSpy.createCategory).not.toHaveBeenCalled();
  });

  it('debería llamar a deleteCategory con el ID correcto', () => {
    categoriesServiceSpy.deleteCategory.and.returnValue(of(void 0));
    categoriesServiceSpy.loadCategories.and.callThrough();

    component.deleteCategory('1');

    expect(categoriesServiceSpy.deleteCategory).toHaveBeenCalledWith('1');
    expect(categoriesServiceSpy.loadCategories).toHaveBeenCalled();
  });
});
