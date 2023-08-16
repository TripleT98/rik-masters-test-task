import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { UserService } from '@store/user/user.service';
import { User } from '@store/user/user.model';
import { UserDataService } from '@store/user-data/user-data.service';
import { UserData } from '@store/user-data/user-data.model';
import { StatusService } from '@store/status/status.service';
import { RoleService } from '@store/role/role.service';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { FormControlService, FormList, FormType, WithControlForm } from '@service/form-control.service';
import { DestroyService } from '@service/destroy.service';
import { Observable, combineLatest, take, takeUntil } from 'rxjs';
import { FILTER_NAME_TOKEN } from './../account-list.module';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [DestroyService]
})
export class FilterComponent implements OnInit {

  @Output()filterChange = new EventEmitter();

  protected formArray: WithControlForm[] = [];
  protected filterFormGroup!: FormGroup;
  protected formList: FormList = [
    {
      prop: 'name' as const,
      name: 'Логин',
      input: {
        type: 'text',
      },
    },
    {
      prop: 'phone' as const,
      name: 'Телефон',
      input: {
        type: 'phone'
      }
    },
    {
      prop: 'create_at' as const,
      name: 'Дата создания',
      input: {
        type: 'date',
      }
    },
    {
      prop: 'status' as const,
      name: 'Статус',
      input: {
        type: 'select',
        options: this.statusS.get$(),
      }
    },
    {
      prop: 'email' as const,
      name: 'E-mail',
      input: {
        type: 'text',
      }
    },
    {
      prop: 'is_admin' as const,
      name: 'Роль',
      input: {
        type: 'select',
        options: this.roleS.get$(),
      }
    },
    {
      prop: 'update_at' as const,
      name: 'Дата изенения',
      input: {
        type: 'date',
      }
    }
  ];
  protected readonly actionButtons: Button[] = [
    {
      name: ButtonName.submit,
      action: this.submit.bind(this)
    },
    {
      name: ButtonName.cancle,
      action: this.cancle.bind(this)
    },
    {
      name: ButtonName.reset,
      action: this.reset.bind(this)
    }
  ]

  constructor(
    private userS: UserService,
    private userDataS: UserDataService,
    private controlS: FormControlService,
    private destroyS: DestroyService,
    private statusS: StatusService,
    private roleS: RoleService,
    @Inject(FILTER_NAME_TOKEN) private readonly formName: string
  ){
  }

  ngOnInit(){
    this.userDataS.get$().pipe(take(1)).subscribe(()=>this.initForm());
  }

  private initForm(){
    this.formArray = this.getFormSet();
    this.filterFormGroup = this.getFormGroup();
    this.filterFormGroup.valueChanges.pipe(takeUntil(this.destroyS.destroy$)).subscribe(filterData=>{
      this.filterChange.emit(filterData);
    });
  }

  private getFormSet(){
    return this.controlS.createControlGroup(this.formName, this.formList);
  }

  private getFormGroup(){
    return this.controlS.getGroup(this.formName);
  }

  private submit(){

  }
  private cancle(){

  }
  private reset(){

  }

}

export type FilterFormsType = {
  [key in keyof (User & UserData)]: (User & UserData)[key];
}

type Button = {
  name: ButtonName,
  action: Function,
}

enum ButtonName {
  submit = "Применить",
  cancle = "Отмена",
  reset = "Сбросить"
}
