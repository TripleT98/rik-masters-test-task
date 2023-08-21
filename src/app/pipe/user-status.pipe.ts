import { PipeTransform, Pipe } from '@angular/core';
import { UserService } from '@store/user/user.service';
import { Id } from '@store/root-store';
import { UserDataService } from '@store/user-data/user-data.service';
import { UserData } from '@store/user-data/user-data.model';
import { Status } from '@store/user-data/user-data.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Pipe({
  name: 'userData'
})
export class UserDataPipe implements PipeTransform {

  constructor(
    private userS: UserService,
    private userDataS: UserDataService
  ){}

  transform(userId:Id): Observable<UserData | undefined>{
    return this.userDataS.getID$(userId).pipe(map(userData=>{
      return userData ? {...userData, status: userData.status === Status["Активен"] ? Status["ACTIVE"] : Status['BLOCKED']} : userData;
    }));
  }

}
