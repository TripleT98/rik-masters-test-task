import { Injectable } from '@angular/core';
import { UserData } from './user-data.model';
import { EntityStore, EntityState } from "@store/root-store";
import { MainResponse } from "@type/response.type";

const storeName = "User"

export class UserDataState extends EntityState<UserData>{

  constructor(
    initialValue: UserData[],
    idKey: string,
  ){
    super(initialValue, idKey);
  }

  override preAdd(prevState: UserData[], newState: MainResponse): UserData[]{
    return newState['data'];
  }

}

@Injectable({providedIn:'root'})
export class UserDataStore extends EntityStore<UserData>{

  constructor(
  ){
    super(new UserDataState([], 'user_id'), storeName);
  }

}
