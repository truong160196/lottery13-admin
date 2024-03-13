import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const VipEndpoint = `${endpoint}/vip`;

export const VipApi = {
  getList: async ({ params }) =>
    await api
      .get(`${VipEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api.get(`${VipEndpoint}/detail/${id}`).then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${VipEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${VipEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${VipEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
