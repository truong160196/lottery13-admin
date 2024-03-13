import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const ProductEndpoint = `${endpoint}/manager/product`;

export const ProductApi = {
  getList: async ({ params }) =>
    await api
      .get(`${ProductEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${ProductEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${ProductEndpoint}/create`, params)
      .then((result) => result.data),
  like: async ({ params }) =>
    await api
      .post(`${ProductEndpoint}/like`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${ProductEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${ProductEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
