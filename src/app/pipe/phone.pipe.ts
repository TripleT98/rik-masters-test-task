import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(phone:number): string{
    const strPhone = String(phone);
    if(strPhone.length !== 11){
      return strPhone
    }
    const firstPart = strPhone.slice(0,1);
    const secPart = strPhone.slice(1,4);
    const thrdPart = strPhone.slice(4,7);
    const fthPart = strPhone.slice(7,9);
    const fivPart = strPhone.slice(9,11);
    return `+${firstPart}(${secPart}) ${thrdPart}-${fthPart}-${fivPart}`
  }

}
