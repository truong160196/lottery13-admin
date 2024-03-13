import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const NotificationEndpoint = `${endpoint}/manager/common/notifications`;

export const NotificationApi = {
  getList: async ({ params }) =>
    await api
      .get(`${NotificationEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${NotificationEndpoint}/detail/${id}`)
      .then((result) => result.data?.data),
  create: async ({ params }) =>
    await api
      .post(`${NotificationEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${NotificationEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${NotificationEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
