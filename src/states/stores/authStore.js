import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

export class AuthStore {
  token = "";

  user = null;

  permissions = [];

  role = null;

  position = null;

  isAdmin = false;

  device = "";

  dice_url = "";

  general = null;

  games = [];

  item_ball = [];

  item_number = [];

  lucky = [];

  products = [];

  logo = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "AuthStore",
      properties: ["token", "user", "device"],
      storage: window.localStorage,
    });
  }

  get authenticated() {
    // TODO: This logic can be changed on demand
    return !!this.token;
  }

  clear = () => {
    this.token = "";
    this.user = null;
    this.role = null;
  };

  setInitData = (data) => {
    this.device = data?.device_code;
    this.games = data?.games || [];
    this.dice_url = data?.dice_url;
    this.item_ball = data?.item_ball || [];
    this.item_number = data?.item_number || [];
    this.lucky = data?.lucky || [];
    this.products = data?.products || [];
    const general = data?.general || [];

    if (Array.isArray(general)) {
      const logoData = general?.find((obj) => obj?.name === "logo");
      if (logoData) {
        this.logo = logoData?.image_url;
      }
    }

    const newsValue = {};

    general.forEach((item, index) => {
      newsValue[item.name] = item.value;
      if (item.value === "0") {
        newsValue[item.name] = false;
      }
    });

    this.general = newsValue;
  };

  setGeneral = (data) => {
    this.general = data;

    if (Array.isArray(data)) {
      const logoData = data?.find((obj) => obj?.name === "logo");
      if (logoData) {
        this.logo = logoData?.image_url;
      }
    }
  };

  updateToken(token) {
    this.token = token || this.token;
  }

  updateUser(user) {
    this.user = user;
    this.role = user?.role;
    this.position = user?.position_key;
    this.isAdmin = user?.role === "admin";
  }
}
