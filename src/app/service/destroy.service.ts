import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DestroyService implements OnDestroy{

  public readonly destroy$ = new Subject();

  ngOnDestroy(){
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
