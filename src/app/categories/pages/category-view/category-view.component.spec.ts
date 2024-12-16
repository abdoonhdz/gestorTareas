import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CategoryViewComponent } from './category-view.component';
import { CategoriesService } from '../../services/categories.service';
import { CategoryDialogComponent } from '../../shared/category-dialog/category-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('CategoryViewComponent', () => {
  let component: CategoryViewComponent;
  let fixture: ComponentFixture<CategoryViewComponent>;
  let mockCategoriesService: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockCategoriesService = {
      categories$: of([]),
      loadCategories: jasmine.createSpy('loadCategories'),
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
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useValue: {
              getTranslation: () => of({}),
            },
          },
        }),
      ],
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

  it('debería cargar categorías al inicializar', () => {
    component.ngOnInit();
    expect(mockCategoriesService.loadCategories).toHaveBeenCalled();
  });

  it('debería llamar a createCategory cuando el formulario sea válido y se envíe', () => {
    component.categoryForm.setValue({ name: 'Nueva categoría', description: 'Descripción' });
    component.createCategory();

    expect(mockCategoriesService.createCategory).toHaveBeenCalledWith({
      name: 'Nueva categoría',
      description: 'Descripción',
    });
  });

  it('no debería llamar a createCategory si el formulario es inválido', () => {
    component.categoryForm.setValue({ name: '', description: '' });
    component.createCategory();

    expect(mockCategoriesService.createCategory).not.toHaveBeenCalled();
  });

  it('debería abrir el diálogo de confirmación al eliminar una categoría', () => {
    component.deleteCategory('123');
    expect(mockDialog.open).toHaveBeenCalledWith(CategoryDialogComponent);
  });

  it('debería llamar a deleteCategory del servicio si el diálogo devuelve true', () => {
    component.deleteCategory('123');
    expect(mockCategoriesService.deleteCategory).toHaveBeenCalledWith('123');
  });

  it('no debería llamar a deleteCategory del servicio si el diálogo devuelve false', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of(false) });
    component.deleteCategory('123');
    expect(mockCategoriesService.deleteCategory).not.toHaveBeenCalled();
  });

  it('debería manejar errores al cargar categorías', () => {
    spyOn(console, 'error');
    mockCategoriesService.categories$ = throwError(() => new Error('Error al cargar las categorías'));
    component.loadCategories();
    expect(console.error).toHaveBeenCalledWith('Error al cargar las categorías');
  });

  it('debería manejar errores al crear una categoría', () => {
    spyOn(console, 'error');
    mockCategoriesService.createCategory.and.returnValue(throwError(() => new Error('Error al crear la categoría')));

    component.categoryForm.setValue({ name: 'Nueva categoría', description: 'Descripción' });
    component.createCategory();

    expect(console.error).toHaveBeenCalledWith('Error al crear la categoría');
  });

  it('debería manejar errores al eliminar una categoría', () => {
    spyOn(console, 'error');
    mockCategoriesService.deleteCategory.and.returnValue(throwError(() => new Error('Error al eliminar la categoría')));

    component.deleteCategory('123');

    expect(console.error).toHaveBeenCalledWith('Error al eliminar la categoría');
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
