import { Injectable, inject } from '@angular/core';
import { RequestHttpService } from '@service/request-http.service';
import { UserData } from './user-data.model';
import { UserDataStore } from './user-data.store';
import { HttpService } from "@service/http.service";

@Injectable({providedIn: 'root'})
export class UserDataService extends RequestHttpService<UserData>{

  constructor(
    store: UserDataStore
  ){
    super(store, 'http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/', inject(HttpService));
  }

}
