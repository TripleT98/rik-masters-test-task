import { Component, OnInit } from '@angular/core';
import { UserService } from '@store/user/user.service';
import { UserDataService } from '@store/user-data/user-data.service';
import { Status } from '@store/user-data/user-data.model';
import { User } from '@store/user/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit {

  protected users$: Observable<User[]> = this.userS.get$();
  protected readonly columns = ["Действия", "Логин", "E-mail", "Телефон", "Роли", "Дата изменения", "Дата создания", "Статус", "Наличие ЭП"] as const;
  protected readonly statuses = [Status['ACTIVE'], Status['BLOCKED']] as const;
  protected readonly title = "Настройка учетных записей сотрудников";

  constructor(
    private userS: UserService,
    private userDataS: UserDataService
  ){

  }

  ngOnInit(){
  }

}
