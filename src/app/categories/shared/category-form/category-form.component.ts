import { Component } from '@angular/core';
import { Categories } from '../../models/categories.model';
import { CategoriesService } from '../../services/categories.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {

  categories: Categories[] = [];
  categoryForm: FormGroup;

  constructor(private categoriesService: CategoriesService) {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)])
    });
  }

  ngOnInit(): void {
    this.categoriesService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.categoriesService.loadCategories();
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      const newCategory: Categories = this.categoryForm.value;
      this.categoriesService.createCategory(newCategory).subscribe(() => {
        this.categoriesService.loadCategories();
        this.categoryForm.reset();
      });
    }
  }

  deleteCategory(id: string): void {
    this.categoriesService.deleteCategory(id).subscribe(() => {
      this.categoriesService.loadCategories();
    });
  }

}
