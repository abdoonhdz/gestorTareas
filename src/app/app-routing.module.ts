import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageGuard } from './core/guards/language.guard';

const routes: Routes = [
  {
    path: 'tasks',
    loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
    data: { animation: 'TasksPage' },
    canActivate: [LanguageGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
    data: { animation: 'CategoriesPage' }
  },
  {
    path: 'sprints',
    loadChildren: () => import('./sprints/sprints.module').then(m => m.SprintsModule),
    data: { animation: 'SprintsPage' }
  },
  {
    path: 'users',
    loadChildren: () => import('./users/user.module').then(m => m.UserModule),
    data: { animation: 'UsersPage' }
  },
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'tasks'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
