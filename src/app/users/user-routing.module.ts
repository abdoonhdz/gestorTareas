import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNewComponent } from './pages/user-new/user-new.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';

const routes: Routes = [
   { path: '', component: UserListComponent},
   { path: 'new', component: UserNewComponent},
   { path: 'edit/:id', component: UserNewComponent},
   { path: ':id', component: UserDetailComponent},
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
