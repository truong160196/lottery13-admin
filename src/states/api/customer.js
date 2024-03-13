import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const CustomerEndpoint = `${endpoint}/manager/customer`;

export const CustomerApi = {
  getList: async ({ params }) =>
    await api
      .get(`${CustomerEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getReport: async ({ params }) =>
    await api
      .get(`${CustomerEndpoint}/report`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${CustomerEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${CustomerEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${CustomerEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${CustomerEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
