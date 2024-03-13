import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const GiftEndpoint = `${endpoint}/manager/user-gift`;

export const GiftApi = {
  getList: async ({ params }) =>
    await api.get(`${GiftEndpoint}/list`, params).then((result) => result.data),
  getDetail: async ({ id }) =>
    await api.get(`${GiftEndpoint}/detail/${id}`).then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${GiftEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${GiftEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${GiftEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
