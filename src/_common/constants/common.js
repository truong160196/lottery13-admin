export const DATE_TIME_FORMAT = "DD/MM/YYYY";
export const LOCATION_KEY = "location_id";

export const LocalStorage = {
  Token: "remix_cms_token",
  Device: "remix_device_init",
  StockId: "remix_stock_id",
  LocationId: "remix_location_id",
  Firebase: "remix_firebase_token",
};

const isDev = process.env.NODE_ENV === "development";

export const endpoint = isDev
  ? process.env.APP_API_DEV
  : process.env.APP_API_PROD;

export const socketUrl = process.env.SOCKET_URL;

export const config = {
  app_id: "remix",
  appId: 2,
};

export const statusText = {
  inactive: "Bình thường",
  active: "Kích hoạt",
};

export const statusColor = {
  inactive: "#f50",
  active: "#87d068",
};
