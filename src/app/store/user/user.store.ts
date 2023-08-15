import { Injectable } from '@angular/core';
import { User } from './user.model';
import { EntityStore, EntityState } from "@store/root-store";
import { MainResponse } from "@type/response.type";

const storeName = "User"

export class UserState extends EntityState<User>{

  constructor(
    initialValue: User[],
    idKey: string,
  ){
    super(initialValue, idKey);
  }

  override preAdd(prevState: User[], newState: MainResponse): User[]{
    return newState['users'];
  }

}

@Injectable({providedIn:'root'})
export class UserStore extends EntityStore<User>{

  constructor(
  ){
    super(new UserState([], 'id'), storeName);
  }

}
