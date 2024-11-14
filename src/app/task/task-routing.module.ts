import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';

const routes: Routes = [
  { path: '', component: TaskListComponent},
  { path: 'new', component: TaskFormComponent, data: { animation: 'TaskForm' }},
  { path: 'edit/:id', component: TaskDetailComponent, data: { animation: 'TaskDetail' }},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }