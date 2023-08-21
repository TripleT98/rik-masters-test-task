import { Injectable, inject } from '@angular/core';
import { RequestHttpService } from '@service/request-http.service';
import { UserData, Status } from './user-data.model';
import { UserDataStore } from './user-data.store';
import { HttpService } from "@service/http.service";

@Injectable({providedIn: 'root'})
export class UserDataService extends RequestHttpService<UserData>{

  constructor(
    store: UserDataStore
  ){
    super(store, inject(HttpService), 'http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/');
  }

  createUserDataParams(userData: UserData){
    this.add(userData)
  }

  blockUser(userId:number){
    const curUserData = this.getID(userId);
    const newData = {is_ecp: false, is_admin: false, ...curUserData, user_id:userId, status: Status['Заблокирован']};
    this.add(newData);
  }

  unblockUser(userId:number){
    const curUserData = this.getID(userId);
    const newData = {is_ecp: false, is_admin: false, ...curUserData, user_id:userId, status: Status['Активен']};
    this.add(newData);
  }

}
