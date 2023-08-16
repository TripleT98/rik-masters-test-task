import { Injectable } from '@angular/core';
import { User } from '@store/user/user.model';
import { UserData } from '@store/user-data/user-data.model';
import { FilterFormsType } from './filter.component';

@Injectable()
export class AccountsFilterService {

  //name, email
  filterByString(users: User[], value: string, prop: keyof GetPropType<User, string>):User[]{
    return users.filter(user=>user[prop].includes(value));
  }
  //phone
  filterByPhone(users: User[], phone: string): User[]{
    return users.filter(user=>String(user.phone).includes(phone));
  }
  //date
  filterByDate(users: User[], value: Date, prop: keyof GetPropType<User, Date>):User[]{
    const date = new Date(value);
    const [day, month, year] = this.getDateMonthYear(date);
    return users.filter(user=>{
      const [curDay, curMonth, curYear] = this.getDateMonthYear(date);
      return curDay === day && curMonth === month && curYear === year;
    });
  }

  private getDateMonthYear(date: Date):[number,number,number]{
    return [date.getDay(), date.getMonth(), date.getFullYear()]
  }
}

type GetPropType<T, D> = {
  [key in keyof T as T[key] extends D ? key : never]: D;
}
