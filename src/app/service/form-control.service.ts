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
      if(formData.input.validators){
        formData.control.setValidators(formData.input.validators)
      }
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

  public isFormEmpty(groupName: string): boolean{
    let isEmpty = true;
    const groupValue = this.getGroup(groupName).value;
    for(let prop in groupValue){
      const val = groupValue[prop];
      if(val !== null && val !== undefined && val !== ''){
        isEmpty = false;
      }
    }
    return isEmpty;
  }

  public getFormSnapshot(groupName: string){
    const groupValue = this.getGroup(groupName).value;
    return JSON.stringify(groupValue);
  }

  public compareFormValues(formVal1: string, formVal2: string){
    return formVal1 === formVal2;
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
