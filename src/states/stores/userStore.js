import { makeAutoObservable } from "mobx";

export class UserStore {
  profile = {};

  constructor() {
    makeAutoObservable(this);
  }

  setProfile(data) {
    this.profile = data;
  }

  clear() {
    this.profile = {};
  }
}
