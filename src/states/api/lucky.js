import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const LuckyEndpoint = `${endpoint}/manager/user-lucky`;

export const LuckyApi = {
  getList: async ({ params }) =>
    await api
      .get(`${LuckyEndpoint}/list`, params)
      .then((result) => result.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${LuckyEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${LuckyEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${LuckyEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${LuckyEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
