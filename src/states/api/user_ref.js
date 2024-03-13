import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const UserRefEndpoint = `${endpoint}/manager/administrator/user-ref`;

export const UserRefApi = {
  getList: async ({ params }) =>
    await api
      .get(`${UserRefEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${UserRefEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${UserRefEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${UserRefEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${UserRefEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
