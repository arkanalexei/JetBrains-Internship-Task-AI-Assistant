import { atom } from "recoil";

export const currentModelState = atom<"Speed" | "Quality">({
  key: "currentModelState",
  default: localStorage.getItem("currentModelState") as "Speed" | "Quality" || "Quality",
});
