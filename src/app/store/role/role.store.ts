import { Injectable } from '@angular/core';
import { Role } from './role.model';
import { EntityStore, EntityState } from "@store/root-store";
import { MainResponse } from "@type/response.type";

const storeName = "Role"

export class UserState extends EntityState<Role>{

  constructor(
    initialValue: Role[],
    idKey: string,
  ){
    super(initialValue, idKey);
  }

}

@Injectable({providedIn:'root'})
export class UserStore extends EntityStore<Role>{

  constructor(
  ){
    super(new UserState([], 'id'), storeName);
  }

}
