import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const BankEndpoint = `${endpoint}/manager/user-bank`;

export const BankApi = {
  getList: async ({ params }) =>
    await api
      .get(`${BankEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api.get(`${BankEndpoint}/detail/${id}`).then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${BankEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${BankEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${BankEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
