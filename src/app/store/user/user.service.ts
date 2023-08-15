import { Injectable, inject } from '@angular/core';
import { RequestHttpService } from '@service/request-http.service';
import { User } from './user.model';
import { UserStore } from './user.store';
import { HttpService } from "@service/http.service";

@Injectable({providedIn: 'root'})
export class UserService extends RequestHttpService<User>{

  constructor(
    store: UserStore
  ){
    super(store, 'http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/', inject(HttpService));
  }

}
