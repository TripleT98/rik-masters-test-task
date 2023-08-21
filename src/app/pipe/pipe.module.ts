import { NgModule } from '@angular/core';
import { PhonePipe } from './phone.pipe';
import { UserDataPipe } from './user-status.pipe';
import { FormErrorPipe } from './form-error.pipe';
import { IsNullablePipe } from './check-nullable-value.pipe';

const pipes = [
  PhonePipe,
  UserDataPipe,
  FormErrorPipe,
  IsNullablePipe
]

@NgModule({
  declarations:[
    ...pipes
  ],
  imports:[

  ],
  exports:[
    ...pipes
  ]
})
export class PipesModule{}
