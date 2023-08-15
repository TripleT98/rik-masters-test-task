import { NgModule } from '@angular/core';
import { PhonePipe } from './phone.pipe';
import { UserDataPipe } from './user-status.pipe';

const pipes = [
  PhonePipe,
  UserDataPipe
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
