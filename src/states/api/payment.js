import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const PaymentEndpoint = `${endpoint}/manager/payment`;

export const PaymentApi = {
  getList: async ({ params }) =>
    await api
      .get(`${PaymentEndpoint}/list`, params)
      .then((result) => result.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${PaymentEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${PaymentEndpoint}/create`, params)
      .then((result) => result.data),
  updateStatus: async ({ id, params }) =>
    await api
      .put(`${PaymentEndpoint}/update-status/${id}`, params)
      .then((result) => result.data),
  updateBalance: async ({ params }) =>
    await api
      .post(`${PaymentEndpoint}/update-balance`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${PaymentEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ params }) =>
    await api
      .post(`${PaymentEndpoint}/delete`, params)
      .then((result) => result.data),
};
