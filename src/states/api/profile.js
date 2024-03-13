import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const ProfileEndpoint = `${endpoint}/user`;
const AuthEndpoint = `${endpoint}/auth`;

export const ProfileApi = {
  getList: async ({ params }) =>
    await api.get(`${ProfileEndpoint}`, params).then((result) => result.data),
  getDetail: async ({ id }) =>
    await api.get(`${ProfileEndpoint}/${id}`).then((result) => result.data),
  changePassword: async ({ params }) =>
    await api
      .post(`${ProfileEndpoint}/change-password`, params)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api.post(`${ProfileEndpoint}`, params).then((result) => result.data),
  update: async ({ params }) =>
    await api
      .put(`${ProfileEndpoint}/update-profile`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api.delete(`${ProfileEndpoint}/${id}`).then((result) => result.data),
};
