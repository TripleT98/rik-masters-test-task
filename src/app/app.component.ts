import { Component, ChangeDetectorRef } from '@angular/core';
import { ResizeObserverService } from '@service/resize-observer.service';
import { UserService } from '@store/user/user.service';
import { User } from '@store/user/user.model';
import { UserDataService } from '@store/user-data/user-data.service';
import { Observable, map, mergeMap, filter } from "rxjs";
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  //Ресайз обзервер
  protected readonly resizeObserver!: ResizeObserver;
  protected readonly version: string = packageJson.version;
  //Ширина при которой скрываем показываем бургер-кнопку
  private burgerWidth: number = 1024;
  protected menuStatus: boolean = false;
  protected openMenuButtonStatus: boolean = false;

  protected user$: Observable<{name: string, status: string}> = this.userS.get$().pipe(
    map(users=>users?.[0]),
    filter(user=>!!user),
    mergeMap(user=>this.userDataS.getID$(user.id).pipe(map(userData=>{
      const status = userData?.is_admin ? 'Администартор' : "Пользователь";
      return {name: user.name, status}
    })))
  );

  constructor(
    private resizeS: ResizeObserverService,
    private cdr: ChangeDetectorRef,
    protected userS: UserService,
    private userDataS: UserDataService,
  ){
    this.resizeObserver = this.resizeS.createObserver(document.getElementsByTagName('body')[0], this.resizeSubscriber.bind(this));
  }

  public resizeSubscriber(obsElems: ResizeObserverEntry[]){
    const bodyWidth = obsElems[0].borderBoxSize[0].inlineSize;
    if(bodyWidth <= this.burgerWidth){
      this.openMenuButtonStatus = true;
    }else{
      this.openMenuButtonStatus = false;
    }
    this.cdr.detectChanges();
  }

  openMenu(){
    this.menuStatus = !this.menuStatus;
    this.cdr.detectChanges();
  }

}
