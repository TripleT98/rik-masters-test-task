import { Component, OnInit, EventEmitter, Output, Inject, Input } from '@angular/core';
import { UserService } from '@store/user/user.service';
import { User } from '@store/user/user.model';
import { UserDataService } from '@store/user-data/user-data.service';
import { UserData } from '@store/user-data/user-data.model';
import { StatusService } from '@store/status/status.service';
import { RoleService } from '@store/role/role.service';
import { FormGroup, AbstractControl, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { FormControlService, FormList, FormType, WithControlForm } from '@service/form-control.service';
import { DestroyService } from '@service/destroy.service';
import { Button, ButtonName } from '@type/buttons.types';
import { Observable, BehaviorSubject, combineLatest, take, takeUntil, map, startWith } from 'rxjs';
import { FILTER_NAME_TOKEN, USER_ADD_TOKEN, filterName, userAdd } from './../account-list.module';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  providers: [DestroyService]
})
export class FilterComponent implements OnInit {

  protected _formType!:string;
  @Input() set formType(formType: string){
    this._formType = formType;
    if(formType === userAdd){
      this.deleteFormFields(['create_at', 'update_at']);
      this.setInitialValidators();
    };
  }

  @Output() filterChange = new EventEmitter();

  protected readonly maxDate = new Date();
  protected formArray!: WithControlForm[];
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
        validators: [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
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
  private filterSnapshoot: string = '';

  protected filterStatus$ = new BehaviorSubject<'on' | 'off'>('off');
  protected disableSaveButton$!: Observable<boolean>;
  protected disableCancleButton$!: Observable<boolean>;
  protected disableResetButton$!: Observable<boolean>;
  protected readonly actionButtons: Button[] = [
    {
      name: ButtonName.submit,
      action: this.submit.bind(this),
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
    @Inject(FILTER_NAME_TOKEN) protected readonly formName: string,
    @Inject(USER_ADD_TOKEN) protected readonly userAddFormName: string
  ){
  }

  ngOnInit(){
    this.userDataS.get$().pipe(take(1)).subscribe(()=>this.initForm());
  }

  private initForm(){
    this.formArray = this.getFormSet();
    this.filterFormGroup = this.getFormGroup();
    this.disableSaveButton$ = combineLatest(this.filterFormGroup.valueChanges.pipe(startWith(null)), this.filterStatus$).pipe(
      map(([_, filterStatus])=>{
        const isEmpty: boolean = this.controlS.isFormEmpty(this._formType);
        const isInvalid: boolean = this.filterFormGroup.status === "INVALID";
        const isFilterChanged: boolean = !this.controlS.compareFormValues(this.filterSnapshoot, this.controlS.getFormSnapshot(this._formType));
        return isEmpty || isInvalid || (filterStatus === 'on' && !isFilterChanged);
      }),
      takeUntil(this.destroyS.destroy$)
    );
    this.disableCancleButton$ = this.filterFormGroup.valueChanges.pipe(
      startWith(null),
      map(val=>{
        const isEmpty: boolean = this.controlS.isFormEmpty(this._formType);
        return isEmpty;
      }),
      takeUntil(this.destroyS.destroy$)
    );
    this.disableResetButton$ = combineLatest(this.filterFormGroup.valueChanges.pipe(startWith(null)), this.filterStatus$).pipe(
      map(([val, filterStatus])=>{
        const isEmpty: boolean = this.controlS.isFormEmpty(this._formType);
        return isEmpty && filterStatus === 'off';
      }),
      takeUntil(this.destroyS.destroy$)
    );
    this.setButtonDisablers();
    this.setFormSnapshoot();
  }

  private deleteFormFields(filelds: string[]){
    this.formList = this.formList.filter(formData=>!filelds.includes(formData.prop));
  }

  private setFormSnapshoot(){
    this.filterSnapshoot = this.controlS.getFormSnapshot(this._formType);
  }

  private setButtonDisablers(){
    this.actionButtons.forEach(button=>{
      switch(button.name){
        case ButtonName.submit: button.disableAsync$ = this.disableSaveButton$;break;
        case ButtonName.cancle: button.disableAsync$ = this.disableCancleButton$;break;
        case ButtonName.reset: button.disableAsync$ = this.disableResetButton$;break;
      }
    })
  }

  private getFormSet(){
    return this.controlS.createControlGroup(this._formType, this.formList);
  }

  private getFormGroup(){
    return this.controlS.getGroup(this._formType);
  }

  private submit(){
    this.filterChange.emit(this.filterFormGroup.value);
    this.setFormSnapshoot();
    this.filterStatus$.next('on');
  }
  private cancle(){
    this.filterFormGroup.reset();
  }
  private reset(){
    this.filterFormGroup.reset();
    this.submit();
    this.filterStatus$.next('off');
  }

  //вызывать только до инициализации формы
  private setInitialValidators(){
    const initialValidators: ValidatorFn[] = [Validators.required];
    this.formList.forEach(formData=>{
      let curValidrs = formData.input.validators || [];
      formData.input.validators = [...curValidrs,...initialValidators];
    })
  }

}

export type FilterFormsType = {
  [key in keyof (User & UserData)]: (User & UserData)[key];
}
