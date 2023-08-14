import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

const modules = [
  MatButtonModule,
  MatTableModule,
  FormsModule,
  ReactiveFormsModule
]

@NgModule({
  imports:[
    CommonModule,
    ...modules
  ],
  declarations:[

  ],
  exports:[
    CommonModule,
    ...modules
  ],
})
export class MaterialModule {}
