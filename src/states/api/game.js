import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const GameEndpoint = `${endpoint}/manager/games`;

export const GameApi = {
  getList: async ({ params }) =>
    await api
      .get(`${GameEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getReport: async ({ params }) =>
    await api
      .get(`${GameEndpoint}/report`, params)
      .then((result) => result.data?.data),
  getStatic: async ({ params }) =>
    await api
      .get(`${GameEndpoint}/static`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${GameEndpoint}/detail/${id}`)
      .then((result) => result.data?.data),
  getGameInfo: async ({ params }) =>
    await api
      .get(`${GameEndpoint}/info`, params)
      .then((result) => result.data?.data),
  update: async ({ params }) =>
    await api
      .put(`${GameEndpoint}/update`, params)
      .then((result) => result.data),
  delete: async ({ params }) =>
    await api
      .post(`${GameEndpoint}/delete`, params)
      .then((result) => result.data),
};
