import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const ContactEndpoint = `${endpoint}/manager/contact`;

export const ContactApi = {
  getList: async ({ params }) =>
    await api
      .get(`${ContactEndpoint}/list`, params)
      .then((result) => result.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${ContactEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${ContactEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${ContactEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${ContactEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
