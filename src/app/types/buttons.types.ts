import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export type Button = {
  name: ButtonName,
  action: Function,
  validators?: ValidatorFn[],
  disableAsync$?: Observable<boolean>,
  icon?: string,
}

export enum ButtonName {
  submit = "Применить",
  cancle = "Отмена",
  reset = "Сбросить",
  add = "Добавить",
  block = "Заблокировать",
  unblock = "Разблокировать",
  filter = "Фильтр"
}
