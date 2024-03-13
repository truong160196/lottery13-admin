import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const UserEndpoint = `${endpoint}/manager/administrator/users`;

export const UserApi = {
  getList: async ({ params }) =>
    await api
      .get(`${UserEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api.get(`${UserEndpoint}/detail/${id}`).then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${UserEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${UserEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  updateAccount: async ({ id, params }) =>
    await api
      .put(`${UserEndpoint}/update-account/${id}`, params)
      .then((result) => result.data),
  reset: async ({ params }) =>
    await api
      .post(`${UserEndpoint}/reset`, params)
      .then((result) => result.data),
  delete: async ({ params }) =>
    await api
      .post(`${UserEndpoint}/delete`, params)
      .then((result) => result.data),
};
