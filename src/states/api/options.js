import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const OptionEndpoint = `${endpoint}/manager/options`;

export const OptionApi = {
  getList: async ({ params }) =>
    await api
      .get(`${OptionEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${OptionEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${OptionEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${OptionEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${OptionEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
