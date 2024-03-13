import { endpoint } from "_common/constants/common";
import api from "states/drivers";

export const AuthApi = {
  getDeviceCode: async () =>
    await api
      .post(`${endpoint}/device/init`)
      .then((result) => result.data?.data),
  login: async (params) =>
    await api
      .post(`${endpoint}/auth/login`, params)
      .then((result) => result.data),
  logout: async () => await api.post(`${endpoint}/auth/logout`),
  getProfile: async () =>
    await api.get(`${endpoint}/auth/profile`).then((result) => result.data),
};
