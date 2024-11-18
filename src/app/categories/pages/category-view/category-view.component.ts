import { Component, OnInit } from '@angular/core';
import { Categories } from '../../models/categories.model';
import { CategoriesService } from '../../services/categories.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../shared/category-dialog/category-dialog.component';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {

  categories: Categories[] = [];
  categoryForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {

    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.categories$.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Error al cargar las categorías');
      }
    });

    this.categoriesService.loadCategories();
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      this.isLoading = true;
      const newCategory: Categories = this.categoryForm.value;
      this.categoriesService.createCategory(newCategory).subscribe({
        next: () => {
          this.categoryForm.reset();
          this.categoriesService.loadCategories();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          console.error('Error al crear la categoría');
        }
      });
    }
  }

  deleteCategory(id: string): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.categoriesService.deleteCategory(id).subscribe({
          next: () => {
            this.categoriesService.loadCategories();
            this.isLoading = false;
            console.log('eliminado')
          },
          error: () => {
            this.isLoading = false;
            console.error('Error al eliminar la categoría');
          }
        });
      }
    });
  }

  getControl(controlName: string): FormControl {
    return this.categoryForm.get(controlName) as FormControl;
  }
}
