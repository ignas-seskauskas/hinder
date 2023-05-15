import { SessionStorageKey } from "../constants/sessionStorage";
import { User } from "../interfaces/User";

export interface AuthData extends User {
  authorizationHeader: string;
}

export const getAuthData = () => {
  if (sessionStorage.getItem(SessionStorageKey.Login)) {
    return JSON.parse(
      sessionStorage.getItem(SessionStorageKey.Login) ?? ""
    ) as AuthData;
  }

  return null;
};
