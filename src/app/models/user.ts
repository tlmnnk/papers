export enum UserStatus {
  ACTIVE,
  PAUSED,
  BLOCKED
}

export interface User {
  id: number;
  avatar: string;
  balance: number;
  name: string,
  fname: string,
  mname: string,
  status: UserStatus;
  lastUpdatedAt: string;
}

export type UserUpdate = Partial<User>;
