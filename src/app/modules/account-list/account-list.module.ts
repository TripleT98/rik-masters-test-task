import { NgModule , InjectionToken} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material/material.module';
import { AccountListComponent } from './account-list/account-list.component';
import { PipesModule } from '@pipe/pipe.module';
import { FilterComponent } from './filter/filter.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

const filterName = 'userFilter';
export const FILTER_NAME_TOKEN = new InjectionToken<string>(filterName);

@NgModule({
  declarations: [
    AccountListComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PipesModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  exports: [
    AccountListComponent
  ],
  providers: [
    provideNgxMask(),
    { provide: FILTER_NAME_TOKEN, useValue: filterName }
  ]
})
export class AccountListModule { }
