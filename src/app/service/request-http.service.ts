import { Injectable, inject } from "@angular/core";
import { HttpService } from "./http.service";
import { EntityStore, Id } from "../store/root-store";
import { tap } from 'rxjs/operators';

export class RequestHttpService<T extends Record<string, any>>{

  constructor(
    protected store: EntityStore<T>,
    protected path: string,
    protected httpS: HttpService,
  ){
    this.initial();
  }

  initial(){
    this.httpS.get$<T[]>(this.path).subscribe(data=>this.store.set(data))
  }

  getItems(){
    return this.store.getItems();
  }

  get$(){
    return this.store.get$()
  }

  getID(id: Id){
    return this.store.getID(id)
  }

  getID$(id: Id){
    return this.store.getID$(id)
  }

}
