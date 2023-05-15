export enum UserType {
  HobbyFinder,
  Admin,
}

export interface User {
  id: number;
  nickname: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  type: UserType;
}
