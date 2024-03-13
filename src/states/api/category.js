import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const CategoryEndpoint = `${endpoint}/manager/category`;

export const CategoryApi = {
  getList: async ({ params }) =>
    await api
      .get(`${CategoryEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getListChild: async ({ id, params }) =>
    await api
      .get(`${CategoryEndpoint}/list-child/${id}`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${CategoryEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${CategoryEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${CategoryEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${CategoryEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
