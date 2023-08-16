import { Injectable } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class FormControlService {

  private formMap = new Map<string, FormGroup>();

  public createControlGroup(groupName: string, group: FormList): WithControlForm[]{
    const controlGroup = this.getGroup(groupName);
    const withControlGroup = group.map(formData=>({...formData, control: new FormControl(null)} as WithControlForm));
    withControlGroup.forEach(formData => {
      controlGroup.addControl(formData.prop, formData.control);
    })
    return withControlGroup;
  }

  public getGroup(groupName: string): FormGroup{
    const existingForm = this.formMap.get(groupName);
    const controlGroup = existingForm || new FormGroup({});
    if(!existingForm){
      this.formMap.set(groupName, controlGroup);
    }
    return controlGroup;
  }

}

export type FormList = FormType[];

export type FormType<T = InputType> = {
  readonly prop: string;
  name: string;
  input: {
    type: InputType;
    validators?: ValidatorFn[],
    asyncValidators?: AsyncValidatorFn[],
    options?: T extends 'select' ? Observable<any> : undefined;
  }
}

export interface WithControlForm extends FormType {
  control: AbstractControl
}

export type InputType = 'select' | 'date' | 'text' | 'phone';
