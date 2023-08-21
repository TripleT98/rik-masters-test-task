import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ResizeObserverService{

  public readonly observers: ResizeObserver[] = [];

  constructor(){
  }

  createObserver(element: Element, callBack: ResizeObserverCallback){
    const observer = new ResizeObserver(callBack);
    observer.observe(element);
    this.observers.push(observer);
    return observer;
  }

}
