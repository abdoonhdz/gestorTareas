import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguageGuard } from './core/guards/language.guard';
import { LoginComponent } from './auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleComponent } from './users/pages/role/role.component';
import { RoleGuard } from './core/guards/role.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      rolesAllowed: [
        'Administrador'
      ]
    }
  },
  {
    path: 'tasks',
    loadChildren: () => import('./task/task.module').then(m => m.TaskModule),
    canActivate: [LanguageGuard, AuthGuard, RoleGuard],
    data: {
      rolesAllowed: [
        'Administrador',
        'Jefe de Proyecto',
        'Desarrollador'
      ]
    }
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule),
    canActivate: [LanguageGuard, AuthGuard, RoleGuard],
    data: {
      rolesAllowed: [
        'Administrador',
        'Jefe de Proyecto'
      ]
    }
  },
  {
    path: 'sprints',
    loadChildren: () => import('./sprints/sprints.module').then(m => m.SprintsModule),
    canActivate: [LanguageGuard, AuthGuard, RoleGuard],
    data: {
      rolesAllowed: [
        'Administrador',
        'Jefe de Proyecto'
      ]
    }
  },
  {
    path: 'users',
    loadChildren: () => import('./users/user.module').then(m => m.UserModule),
    canActivate: [LanguageGuard, AuthGuard, RoleGuard],
    data: {
      rolesAllowed: [
        'Administrador'
      ]
    }
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
