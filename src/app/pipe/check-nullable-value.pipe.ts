import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'isNullable'
})
export class IsNullablePipe implements PipeTransform {

  transform(value: string | number | null | undefined): boolean{
    const isNullable = value === null || value === undefined || value === '';
    return isNullable;
  }

}
