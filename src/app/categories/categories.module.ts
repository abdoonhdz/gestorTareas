import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CategoryViewComponent } from './pages/category-view/category-view.component';
import { CategoryFormComponent } from './shared/category-form/category-form.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryDialogComponent } from './shared/category-dialog/category-dialog.component';

@NgModule({
  declarations: [
    CategoryViewComponent,
    CategoryFormComponent,
    CategoryDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CategoriesRoutingModule
  ],
  providers: [


  ],
  exports: [

  ]
})
export class CategoriesModule { }
