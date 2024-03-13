import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const ActivityLogEndpoint = `${endpoint}/manager/common/activity-logs`;

export const ActivityLogApi = {
  getList: async ({ params }) =>
    await api
      .get(`${ActivityLogEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${ActivityLogEndpoint}/detail/${id}`)
      .then((result) => result.data?.data),
  create: async ({ params }) =>
    await api
      .post(`${ActivityLogEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${ActivityLogEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${ActivityLogEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
