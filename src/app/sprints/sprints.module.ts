import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SprintDetailComponent } from './pages/sprint-detail/sprint-detail.component';
import { SprintListComponent } from './pages/sprint-list/sprint-list.component';
import { SprintRoutingModule } from './sprints-routing.module';
import { SprintNewComponent } from './pages/sprint-new/sprint-new.component';

@NgModule({
  declarations: [
    SprintDetailComponent,
    SprintListComponent,
    SprintNewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SprintRoutingModule
  ],
  providers: [
  ],
  exports: [
  ]
})
export class SprintsModule { }
