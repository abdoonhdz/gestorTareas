import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserNewComponent } from './pages/user-new/user-new.component';
import { UserListComponent } from './pages/user-list/user-list.component';

const routes: Routes = [
   { path: '', component: UserListComponent, data: { animation: 'UserList' }},
   { path: 'new', component: UserNewComponent, data: { animation: 'UserNew' }},
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }