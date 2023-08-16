import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '@store/user/user.service';
import { UserDataService } from '@store/user-data/user-data.service';
import { Status } from '@store/user-data/user-data.model';
import { FormGroup } from '@angular/forms';
import { User } from '@store/user/user.model';
import { FilterFormsType } from '@accountList/filter/filter.component';
import { FormControlService, FormList, FormType, WithControlForm } from '@service/form-control.service';
import { Observable, Subject, combineLatest, takeUntil, startWith, map } from 'rxjs';
import { FILTER_NAME_TOKEN } from './../account-list.module';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  private readonly filterTrigger$ = new Subject<Partial<FilterFormsType>>();
  protected filterForm: FormGroup = this.controlS.getGroup(this.formName);
  protected users$: Observable<User[]> = combineLatest(
    this.userS.get$(),
    this.filterTrigger$.pipe(startWith(this.filterForm.value))
  ).pipe(map(([users, filterValue])=>this._filter(users, filterValue)));
  protected readonly columns = ["Действия", "Логин", "E-mail", "Телефон", "Роли", "Дата изменения", "Дата создания", "Статус", "Наличие ЭП"] as const;
  protected readonly statuses = [Status['ACTIVE'], Status['BLOCKED']] as const;
  protected readonly title = "Настройка учетных записей сотрудников";

  constructor(
    private userS: UserService,
    private userDataS: UserDataService,
    private controlS: FormControlService,
    @Inject(FILTER_NAME_TOKEN) private readonly formName: string
  ){
  }

  ngOnInit(){
  }

  protected filter(filterData:Partial<FilterFormsType>){
    console.log(filterData)

    this.filterTrigger$.next(filterData);
  }

  private _filter(users: User[], filterData: Partial<FilterFormsType>): User[]{
    const filteredUser = users;
    return filteredUser;
  }

}
