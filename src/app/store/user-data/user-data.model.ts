export type UserData = {
  user_id: number;
  is_admin: boolean;
  is_ecp: boolean;
  status: Status;
}

export enum Status {
  ACTIVE = "Активен",
  BLOCKED = "Заблокирован"
}
