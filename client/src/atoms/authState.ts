import { atom } from "recoil";

export interface AuthState {
  isAuth: boolean;
}

export const authState = atom<AuthState>({
  key: "authState",
  default: {
    isAuth: localStorage.getItem("isAuth") === "true" ? true : false,
  },
});
