import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const SystemBankEndpoint = `${endpoint}/manager/system-bank`;

export const SystemBankApi = {
  getList: async ({ params }) =>
    await api
      .get(`${SystemBankEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${SystemBankEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${SystemBankEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${SystemBankEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${SystemBankEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
