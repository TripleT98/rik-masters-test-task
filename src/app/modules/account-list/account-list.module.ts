import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { AccountListComponent } from './account-list/account-list.component';



@NgModule({
  declarations: [
    AccountListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    AccountListComponent
  ]
})
export class AccountListModule { }
