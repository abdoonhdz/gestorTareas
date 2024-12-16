import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { CategoryDialogComponent } from '../../shared/category-dialog/category-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { CategoryViewComponent } from '../../pages/category-view/category-view.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CategoryViewComponent', () => {
  let component: CategoryViewComponent;
  let fixture: ComponentFixture<CategoryViewComponent>;
  let mockCategoriesService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockCategoriesService = {
      categories$: of([]),
      loadCategories: jasmine.createSpy('loadCategories').and.returnValue(Promise.resolve()),
      createCategory: jasmine.createSpy('createCategory').and.returnValue(of(null)),
      deleteCategory: jasmine.createSpy('deleteCategory').and.returnValue(of(null)),
    };

    mockDialog = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [CategoryViewComponent],
      imports: [ReactiveFormsModule, BrowserAnimationsModule, TranslateModule.forRoot()],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores vacíos', () => {
    expect(component.categoryForm.value).toEqual({ name: '', description: '' });
  });

  it('debería cargar categorías al inicializar', async () => {
    await component.ngOnInit();
    expect(mockCategoriesService.loadCategories).toHaveBeenCalled();
  });

  it('debería manejar errores al cargar categorías', async () => {
    const error = new Error('Error al cargar las categorías');
    mockCategoriesService.loadCategories.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');

    await component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error al cargar las categorías', error);
  });

  it('debería manejar errores al crear una categoría', () => {
    spyOn(console, 'error');
    const error = new Error('Error al crear la categoría');
    mockCategoriesService.createCategory.and.returnValue(throwError(() => error));

    component.categoryForm.setValue({ name: 'Nueva categoría', description: 'Descripción' });
    component.createCategory();

    expect(console.error).toHaveBeenCalledWith('Error al crear la categoría', error);
  });

  it('debería manejar errores al eliminar una categoría', () => {
    spyOn(console, 'error');
    const error = new Error('Error al eliminar la categoría');
    mockCategoriesService.deleteCategory.and.returnValue(throwError(() => error));

    component.deleteCategory('123');

    expect(console.error).toHaveBeenCalledWith('Error al eliminar la categoría', error);
  });

  it('debería deshabilitar el botón de envío si el formulario es inválido', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    component.categoryForm.setValue({ name: '', description: '' });
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeTrue();

    component.categoryForm.setValue({ name: 'Nueva categoría', description: 'Descripción' });
    fixture.detectChanges();

    expect(submitButton.nativeElement.disabled).toBeFalse();
  });
});
