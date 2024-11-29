import { NgModule } from '@angular/core';
import { UserNewComponent } from './pages/user-new/user-new.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TaskRoutingModule } from './user-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { RoleComponent } from './pages/role/role.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskRoutingModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [],
  declarations: [
    UserNewComponent,
    UserListComponent,
    UserDetailComponent,
    RoleComponent
  ],
  providers: [],
})
export class UserModule { }
