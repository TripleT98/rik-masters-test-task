import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { AccountListComponent } from './account-list/account-list.component';
import { PipesModule } from '@pipe/pipe.module';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  declarations: [
    AccountListComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule
  ],
  exports: [
    AccountListComponent
  ]
})
export class AccountListModule { }
