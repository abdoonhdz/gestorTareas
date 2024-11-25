import { NgModule } from '@angular/core';
import { UserNewComponent } from './pages/user-new/user-new.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { TaskRoutingModule } from './user-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { TranslateModule } from '@ngx-translate/core';

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
    UserListComponent
  ],
  providers: [],
})
export class UserModule { }
