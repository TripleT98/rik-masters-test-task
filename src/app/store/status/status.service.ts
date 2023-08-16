import { Injectable, inject } from '@angular/core';
import { RequestHttpService } from '@service/request-http.service';
import { Status } from './status.model';
import { StatusStore } from './status.store';
import { HttpService } from "@service/http.service";

@Injectable({providedIn: 'root'})
export class StatusService extends RequestHttpService<Status>{

  private readonly roles: Status[] = [
    {
      id: 1,
      name: "Активен",
    },
    {
      id: 2,
      name: "Заблокирован",
    },
  ]

  constructor(
    store: StatusStore
  ){
    super(store, inject(HttpService));
    this.set(this.createStatuses());
  }

  private createStatuses(){
    return this.roles.map(role=>new Status(role));
  }

}
