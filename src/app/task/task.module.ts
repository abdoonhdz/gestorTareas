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
import { TaskFilterPipe } from './pipes/task-filter.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { taskReducer } from './task-store/task.reducer';
import { TaskEffects } from './task-store/task.effects';


@NgModule({
  declarations: [
    TaskDetailComponent,
    TaskFormComponent,
    TaskListComponent,
    TaskCardComponent,
    TaskDetailsDialogComponent,
    TaskColumnComponent,
    TaskFormGenericComponent,
    TaskFilterPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskRoutingModule,
    MaterialModule,
    DragDropModule,
    TranslateModule,
    StoreModule.forFeature('tasks', taskReducer),
    EffectsModule.forFeature([TaskEffects]),
  ],
  providers: [
    TaskService
  ],
  exports: [
    TaskFormGenericComponent
  ]
})
export class TaskModule { }
