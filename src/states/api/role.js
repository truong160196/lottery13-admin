import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const RoleEndpoint = `${endpoint}/manager/user/role`;

export const RoleApi = {
  getList: async ({ params }) =>
    await api.get(`${RoleEndpoint}/list`, params).then((result) => result.data),
  getDetail: async ({ id }) =>
    await api.get(`${RoleEndpoint}/detail/${id}`).then((result) => result.data),
  create: async ({ params }) =>
    await api.post(`${RoleEndpoint}`, params).then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${RoleEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api.delete(`${RoleEndpoint}/${id}`).then((result) => result.data),
};
