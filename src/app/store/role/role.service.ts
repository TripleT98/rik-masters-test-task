import { Injectable, inject } from '@angular/core';
import { RequestHttpService } from '@service/request-http.service';
import { Role } from './role.model';
import { UserStore } from './role.store';
import { HttpService } from "@service/http.service";

@Injectable({providedIn: 'root'})
export class RoleService extends RequestHttpService<Role>{

  private readonly roles: Role[] = [
    {
      id: 1,
      name: "Администратор",
    },
    {
      id: 2,
      name: "Пользователь",
    },
  ]

  constructor(
    store: UserStore
  ){
    super(store, inject(HttpService));
    this.set(this.createRoles());
  }

  createRoles(){
    return this.roles.map(role=>new Role(role));
  }

}
