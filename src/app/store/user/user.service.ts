import { Injectable, inject } from '@angular/core';
import { RequestHttpService } from '@service/request-http.service';
import { User, createUser } from './user.model';
import { HttpService } from "@service/http.service";
import { FilterFormsType } from '@accountList/filter/filter.component';
import { UserData, getStatus } from '@store/user-data/user-data.model';
import { RoleService } from '@store/role/role.service';
import { Role } from '@store/role/role.model';
import { UserDataService } from '@store/user-data/user-data.service';
import { StatusService } from '@store/status/status.service';
import { Status } from '@store/status/status.model';
import { UserStore } from './user.store';



const moreUsers: User[] = [
  {
            "id": 3,
            "name": "iivanov",
            "email": "asidorov@vtb.ru",
            "phone": 79991234567,
            "create_at": new Date(1681721695),
            "update_at": new Date(1681724695)
        },
        {
            "id": 4,
            "name": "petrov",
            "email": "petrov@vtb.ru",
            "phone": 79991234599,
            "create_at": new Date(1681721695),
            "update_at": new Date(1681721695)
        },
        {
                  "id": 5,
                  "name": "iivanov",
                  "email": "asidorov@vtb.ru",
                  "phone": 79991234567,
                  "create_at": new Date(1681721695),
                  "update_at": new Date(1681724695)
              },
              {
                  "id": 6,
                  "name": "petrov",
                  "email": "petrov@vtb.ru",
                  "phone": 79991234599,
                  "create_at": new Date(1681721695),
                  "update_at": new Date(1681721695)
              },
              {
                        "id": 7,
                        "name": "iivanov",
                        "email": "asidorov@vtb.ru",
                        "phone": 79991234567,
                        "create_at": new Date(1681721695),
                        "update_at": new Date(1681724695)
                    },
                    {
                        "id": 8,
                        "name": "petrov",
                        "email": "petrov@vtb.ru",
                        "phone": 79991234599,
                        "create_at": new Date(1681721695),
                        "update_at": new Date(1681721695)
                    }
]

@Injectable({providedIn: 'root'})
export class UserService extends RequestHttpService<User>{

  constructor(
    store: UserStore,
    private roleS: RoleService,
    private userDataS: UserDataService,
    private statusS: StatusService
  ){
    super(store, inject(HttpService), 'http://cars.cprogroup.ru/api/rubetek/angular-testcase-list/');
    setTimeout(()=>{moreUsers.forEach(user=>this.add(user))}, 5000)
  }

  createUserFromForm(formData: Partial<FilterFormsType>):void{
    console.log(formData)
    //Создаем пользователя
    const newUser = this.add(this.getUserParams(formData) as User)
    const userDataParams = this.getUserDateParams(newUser.id, formData);
    this.userDataS.add(userDataParams);
  }

  private getUserParams(user: Partial<FilterFormsType>): Partial<User>{
    return createUser(user);
  }

  private getUserDateParams(userId: number, formData: Partial<FilterFormsType>): UserData{
    const {status: statusId, is_admin} = formData;
    return {
      user_id: userId,
      is_admin: (is_admin as unknown as number) === 1 ? true : false,
      is_ecp: false,
      status: getStatus(statusId as unknown as number)
    }
  }

  public blockUser(userId:number){
    this.userDataS.blockUser(userId);
    this.changeUserUpdateDate(userId);
  }

  public unblockUser(userId:number){
    this.userDataS.unblockUser(userId);
    this.changeUserUpdateDate(userId);
  }

  private changeUserUpdateDate(userId: number){
    const user = this.getID(userId);
    if(!user){return};
    const newUser = {...user, update_at: new Date()}
    this.add(newUser)
  }

}
