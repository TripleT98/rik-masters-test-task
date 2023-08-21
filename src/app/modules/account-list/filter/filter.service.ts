import { Injectable } from '@angular/core';
import { User } from '@store/user/user.model';
import { UserData, Status } from '@store/user-data/user-data.model';
import { UserDataService } from '@store/user-data/user-data.service';
import { RoleService } from '@store/role/role.service';
import { StatusService } from '@store/status/status.service';
import { FilterFormsType } from './filter.component';


@Injectable({providedIn: 'root'})
export class AccountsFilterService {

  private readonly filterToProp: FilterToPropType = {
    string:{
      func: this.filterByString.bind(this),
      props: ['name', 'email']
    },
    phone:{
      func: this.filterByPhone.bind(this),
      props: ['phone']
    },
    date:{
      func: this.filterByDate.bind(this),
      props: ['create_at', 'update_at']
    },
    role:{
      func: this.filterByRole.bind(this),
      props: ['is_admin']
    },
    status:{
      func: this.filterByStatus.bind(this),
      props: ['status']
    },
  };

  constructor(
    private userDataS: UserDataService,
    private roleS: RoleService,
    private statusS: StatusService,
  ){

  }

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
      const [curDay, curMonth, curYear] = this.getDateMonthYear(new Date(user[prop]));
      return curDay === day && curMonth === month && curYear === year;
    });
  }
  //role
  filterByRole(users: User[], roleId: number):User[]{
      const userData = this.userDataS.getItems();
      const filteredUsers = users.filter(user=>{
        const isAdmin = userData.find(data=>data.user_id == user.id)?.is_admin;
        return (isAdmin && roleId === 1) || (!isAdmin && roleId === 2);
      })
      return filteredUsers;
  }
  //status
  filterByStatus(users: User[], statusId: number):User[]{
      const userData = this.userDataS.getItems();
      const filteredUsers = users.filter(user=>{
        const status = userData.find(data=>data.user_id == user.id)?.status;
        return (status === Status['Активен'] && statusId === 1) || (status === Status['Заблокирован']  && statusId === 2);
      })
      return filteredUsers;
  }
  private getDateMonthYear(date: Date):[number,number,number]{
    return [date.getDate(), date.getMonth(), date.getFullYear()]
  }
}

type FilterToPropType = {
  [key: string]:{
    func: (...args:any[])=>User[],
    props: (keyof GetPropType<User & UserData, any>)[]
  }
}

type GetPropType<T, D> = {
  [key in keyof T as T[key] extends D ? key : never]: D;
}
