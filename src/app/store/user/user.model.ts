import { FilterFormsType } from '@accountList/filter/filter.component';

export type User = {
  id: number;
  name: string;
  email: string;
  phone: number;
  create_at: Date;
  update_at: Date;
}

export function createUser(userData: Partial<FilterFormsType>): Omit<User, 'id' | 'update_at'>{
  const create_at = new Date().getTime() as unknown as Date;
  const name = userData.name || '';
  const email = userData.email || '';
  const phone = userData.phone || 77777777777;
  return {name, email, phone, create_at};
}
