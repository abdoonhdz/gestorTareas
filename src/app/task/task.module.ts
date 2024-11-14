import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskRoutingModule } from './task-routing.module';
import { TaskCardComponent } from './shared/task-card/task-card.component';
import { MaterialModule } from '../material/material.module';
import { TaskService } from './services/task.service';
import { TaskDetailsDialogComponent } from './shared/task-dialog/task-dialog.component';
import { TaskColumnComponent } from './shared/task-column/task-column.component';
import { TaskFormGenericComponent } from './shared/task-form-generic/task-form-generic.component';

@NgModule({
  declarations: [
    TaskDetailComponent,
    TaskFormComponent,
    TaskListComponent,
    TaskCardComponent,
    TaskDetailsDialogComponent,
    TaskColumnComponent,
    TaskFormGenericComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskRoutingModule,
    MaterialModule,
  ],
  providers: [
    TaskService
  ],
  exports: [
    TaskFormGenericComponent
  ]
})
export class TaskModule { }
