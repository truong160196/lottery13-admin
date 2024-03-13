import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const GamePlayerEndpoint = `${endpoint}/manager/game-player`;

export const GamePlayerApi = {
  getList: async ({ params }) =>
    await api
      .get(`${GamePlayerEndpoint}/list`, params)
      .then((result) => result.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${GamePlayerEndpoint}/detail/${id}`)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .post(`${GamePlayerEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ params }) =>
    await api
      .post(`${GamePlayerEndpoint}/delete`, params)
      .then((result) => result.data),
};
