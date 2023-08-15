import { User } from '@store/user/user.model';
import { UserData } from '@store/user-data/user-data.model';

export type MainResponse = {
  page: Page;
  users: User[];
  data: UserData[];
}

export type Page = {
  total: number;
  current: number;
  size: number;
}
