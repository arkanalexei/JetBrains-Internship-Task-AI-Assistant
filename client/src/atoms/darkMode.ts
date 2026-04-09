import { atom } from "recoil";

export const darkMode = atom<boolean>({
  key: "darkMode",
  default: localStorage.getItem("darkMode") === "true" || false,
});
