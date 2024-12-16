import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SprintListComponent } from './pages/sprint-list/sprint-list.component';
import { SprintDetailComponent } from './pages/sprint-detail/sprint-detail.component';
import { SprintNewComponent } from './pages/sprint-new/sprint-new.component';

const routes: Routes = [
  { path: '', component: SprintListComponent},
  { path: 'new', component: SprintNewComponent},
  { path: ':id', component: SprintDetailComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SprintRoutingModule { }
