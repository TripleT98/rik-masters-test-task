import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { UserService } from '@store/user/user.service';
import { UserDataService } from '@store/user-data/user-data.service';
import { Status } from '@store/user-data/user-data.model';
import { FormGroup } from '@angular/forms';
import { User } from '@store/user/user.model';
import { FilterFormsType } from '@accountList/filter/filter.component';
import { AccountsFilterService } from '@accountList/filter/filter.service';
import { FormControlService, FormList, FormType, WithControlForm } from '@service/form-control.service';
import { ResizeObserverService } from '@service/resize-observer.service';
import { DestroyService } from '@service/destroy.service';
import { GetPropType } from '@accountList/filter/filter.service';
import { Button, ButtonName } from '@type/buttons.types';
import { Observable, Subject, BehaviorSubject, combineLatest, takeUntil, startWith, map, take, tap } from 'rxjs';
import { FILTER_NAME_TOKEN, USER_ADD_TOKEN } from './../account-list.module';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  providers: [DestroyService]
})
export class AccountListComponent implements OnInit {

  protected object = Object;
  protected usersOnPage: number = 4;
  protected readonly sliceUserList$ = new BehaviorSubject<number>(this.usersOnPage);
  protected curPage: number = 1;
  protected readonly page$ = new BehaviorSubject<number>(this.curPage);
  protected showFilter: boolean = true;
  protected showAddPanel: boolean = false;
  private readonly filterTrigger$ = new Subject<Partial<FilterFormsType>>();
  protected readonly sortParams = ["Логин","EMail","Дата изменения", "Дата создания", "Сбросить"] as const;
  protected currentSortParam: typeof this.sortParams[number] | '' = '';
  private readonly sortEmitter$ = new BehaviorSubject<keyof User | null>(null);
  protected filterForm: FormGroup = this.controlS.getGroup(this.formName);
  protected userAddForm: FormGroup = this.controlS.getGroup(this.userAddFormName);
  protected filteredUsers$ = new BehaviorSubject<User[]>([]);
  protected users$: Observable<User[]> = combineLatest(
    this.userS.get$(),
    this.filterTrigger$.pipe(startWith(this.filterForm.value), map(_=>this.filterForm.value)),
    this.sliceUserList$,
    this.page$,
    this.sortEmitter$,
  ).pipe(
    map(([users, filterValue, count, page, sortParam])=>{
      const filteredUsers = this._filter(users, filterValue);
      this.filteredUsers$.next(filteredUsers);
      const sortedUsers = sortParam ? this.sortUsers(filteredUsers, sortParam) : filteredUsers;
      const slicedUsers = this.usePageNSlice(page, count, sortedUsers);
      return slicedUsers;
    }),
    takeUntil(this.destroyS.destroy$)
  );
  protected readonly pageNSlice$: Observable<[number,number]> = combineLatest(this.page$, this.sliceUserList$, this.filteredUsers$).pipe(
    takeUntil(this.destroyS.destroy$),
    map(([page, count, users])=>{
      const usersLength = users?.length;
      const start = this._getStart(page, count) + 1;
      const end = start + count - 1;
      return [start >= usersLength ? usersLength : start, end-1 > usersLength ? usersLength : end];
    }),
  )
  protected selectAll:boolean = false;
  protected selectedUsers: Record<number, boolean> = {};
  protected readonly columns = ["Action", "Login", "EMail", "Phone", "Role", "DateChange", "DateCreation", "Status", "ECP"] as const;
  protected readonly statuses = [Status['ACTIVE'], Status['BLOCKED']] as const;
  protected readonly title = "Настройка учетных записей сотрудников";
  protected readonly actionButtons: Button[] = [
    {
      name: ButtonName.add,
      action: this.add.bind(this),
      icon: 'add_circle_outline'
    },
    {
      name: ButtonName.block,
      action: this.block.bind(this),
      icon: 'highlight_off'
    },
    {
      name: ButtonName.unblock,
      action: this.unblock.bind(this),
      icon: 'check_circle_outline'
    },
    {
      name: ButtonName.filter,
      action: this.openFilter.bind(this),
      icon: 'filter_list'
    }
  ]

  //Ресайз обзервер
  protected readonly resizeObserver!: ResizeObserver;
  //Ширин body при которой таблица замещается карточками
  private readonly tableToCardsWidth = 768;
  protected displayedContent: 'table' | 'cards' = 'table';

  constructor(
    protected userS: UserService,
    private userDataS: UserDataService,
    private controlS: FormControlService,
    private filterS: AccountsFilterService,
    private resizeS: ResizeObserverService,
    private destroyS: DestroyService,
    private cdr: ChangeDetectorRef,
    @Inject(FILTER_NAME_TOKEN) protected readonly formName: string,
    @Inject(USER_ADD_TOKEN) protected readonly userAddFormName: string
  ){
    this.resizeObserver = this.resizeS.createObserver(document.getElementsByTagName('body')[0], this.resizeSubscriber.bind(this));
  }

  ngOnInit(){
  }

  public resizeSubscriber(obsElems: ResizeObserverEntry[]){
    const bodyWidth = obsElems[0].borderBoxSize[0].inlineSize;
    if(bodyWidth <= this.tableToCardsWidth){
      this.displayedContent = 'cards';
    }else{
      this.displayedContent = 'table';
    }
    this.cdr.detectChanges();
  }

  protected filter(filterData:Partial<FilterFormsType>){
    this.filterTrigger$.next(filterData);
  }

  protected emitCount(count: number){
    this.page$.next(1);
    this.sliceUserList$.next(count);
  }

  protected emitPage(dir: -1 | 1){
    this.filteredUsers$.pipe(take(1)).subscribe(users=>{
      const currPage = this.page$.value;
      const currCount = this.sliceUserList$.value;
      const newpage = currPage + dir;
      const start = this._getStart(newpage, currCount)
      const userListlength = users.length;
      if(newpage < 1 || start >= userListlength){return};
      this.page$.next(newpage);
    })
  }

  protected emitSort(sortParam: typeof this.sortParams[number]){
    let userSortingProp: keyof User | null = null;
    switch(sortParam){
      case "Логин": userSortingProp = 'name';break;
      case "EMail": userSortingProp = 'email';break;
      case "Дата изменения": userSortingProp = 'update_at';break;
      case "Дата создания": userSortingProp = 'create_at';break;
    }
    this.sortEmitter$.next(userSortingProp);
  }

  private sortUsers(users: User[], sortParam: keyof User){
    const sortedUsers = [...users];
    return sortedUsers.sort((u1,u2)=>{
      const u1Prop = u1[sortParam];
      const u2Prop = u2[sortParam];
      if(u1Prop === u2Prop){return 0}
      return u1Prop > u2Prop ? 1 : -1;
    })
  }

  private usePageNSlice(page: number, count:number, collection: any[]): any[]{
    const collLength = collection.length;
    const start = this._getStart(page, count);
    const end = start + count;
    if(count > collLength || start > collLength){return collection};
    return collection.slice(start, end);
  }

  private _getStart(page: number, count:number): number{
    return page === 1 ? 0 : ((page - 1)*count);
  }

  private _filter(users: User[], filterData: Partial<FilterFormsType>): User[]{
    let filteredUser = users || [];
    let filterProp!: keyof Partial<FilterFormsType>;
    for(filterProp in filterData){
      if(!Object.prototype.hasOwnProperty.call(filterData, filterProp)){continue};
      const filterValue = filterData[filterProp];
      if(filterValue === null || filterValue === undefined){continue};
        switch(filterProp){
          case 'email':
          case 'name': filteredUser = this.filterS.filterByString(filteredUser, filterValue as string, filterProp); break;
          case 'phone': filteredUser = this.filterS.filterByPhone(filteredUser, filterValue as string); break;
          case 'create_at':
          case 'update_at': filteredUser = this.filterS.filterByDate(filteredUser, filterValue as Date, filterProp); break;
          case 'is_admin': filteredUser = this.filterS.filterByRole(filteredUser, filterValue as number); break;
          case 'status': filteredUser = this.filterS.filterByStatus(filteredUser, filterValue as number); break;
        }
    }
    return filteredUser;
  }

  protected addUser(newUser: Partial<FilterFormsType>){
    this.userS.createUserFromForm(newUser as User);
  }

  private add(){
    this.showFilter = false;
    this.showAddPanel = !this.showAddPanel;
  }
  private block(){
    for(let userId in this.selectedUsers){
      const idAsNumber = Number(userId);
      const isSelected = this.selectedUsers[idAsNumber];
      if(isSelected){
        this.userS.blockUser(idAsNumber)
      }else{
        this.userS.unblockUser(idAsNumber)
      }
    }
    this._clearSelection()
  }
  private unblock(){
    for(let userId in this.selectedUsers){
      const idAsNumber = Number(userId);
      const isSelected = this.selectedUsers[idAsNumber];
      if(isSelected){
        this.userS.unblockUser(idAsNumber)
      }else{
        this.userS.blockUser(idAsNumber)
      }
    }
    this._clearSelection()
  }
  private openFilter(){
    this.showAddPanel = false;
    this.showFilter = !this.showFilter;
  }
  protected selectAllUsers(){
    this.filteredUsers$.pipe(take(1)).subscribe(users=>{
      users.forEach(user=>{
        const idAsNumber = Number(user.id);
        this.selectedUsers[idAsNumber] = this.selectAll;
      })
    });
  }
  protected getSelectedLength(){
    let counts = 0;
    const selectedUsers = this.selectedUsers;
    for(let userId in selectedUsers){
      const idAsNumber = Number(userId);
      if(selectedUsers[idAsNumber]){counts++}
    }
    return counts;
  }
  private _clearSelection(){
    this.selectAll = false;
    this.selectedUsers = {};
  }

}
