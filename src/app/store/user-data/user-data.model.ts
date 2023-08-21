export type UserData = {
  user_id: number;
  is_admin: boolean;
  is_ecp: boolean;
  status: Status;
}

export enum Status {
  ACTIVE = "Активен",
  BLOCKED = "Заблокирован",
  "Активен" = "ACTIVE",
  "Заблокирован" = "BLOCKED",
}

export function getStatus(statusId: number): Status {
  return statusId === 1 ? Status["Активен"] : Status["Заблокирован"];
}
