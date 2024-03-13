import { createContext } from "react";
import { UserStore } from "./userStore";
import { AuthStore } from "./authStore";

export class RootStore {
  constructor() {
    this.authStore = new AuthStore();
    this.userStore = new UserStore();
  }
}
export const rootStore = new RootStore();
export const rootStoreContext = createContext(rootStore);
