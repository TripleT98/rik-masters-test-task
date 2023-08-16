import { Injectable } from '@angular/core';
import { Status } from './status.model';
import { EntityStore, EntityState } from "@store/root-store";
import { MainResponse } from "@type/response.type";

const storeName = "Status"

export class StatusState extends EntityState<Status>{

  constructor(
    initialValue: Status[],
    idKey: string,
  ){
    super(initialValue, idKey);
  }

}

@Injectable({providedIn:'root'})
export class StatusStore extends EntityStore<Status>{

  constructor(
  ){
    super(new StatusState([], 'id'), storeName);
  }

}
