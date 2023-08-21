import { PipeTransform, Pipe } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

const errors = {
  'pattern': 'Введите валидный e-mail',
  'required': 'Это поле обязательно',
} as const;

type ErrorKey = keyof typeof errors;

@Pipe({
  name: 'formError'
})
export class FormErrorPipe implements PipeTransform {

  transform(control: FormControl): Observable<string>{
    return control.valueChanges.pipe(startWith(null), map(_=>{
      //Отображаю только первую ошибку, если она исправлена, то вторую
      let errorText: string = '';
      const formErrors = control.errors;
      let errKey!: ErrorKey;
      for((errKey as string) in formErrors){
        if(errorText){continue};
        errorText = this.getErrorText(errKey);
      }
      console.log(errorText);
      return errorText;
    }))
  }

  private getErrorText(errName: ErrorKey): string{
    return errors[errName] || "";
  }

}
