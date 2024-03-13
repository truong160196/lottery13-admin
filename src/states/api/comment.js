import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const CommentEndpoint = `${endpoint}/manager/common/comments`;

export const CommentApi = {
  getList: async ({ params }) =>
    await api
      .get(`${CommentEndpoint}/list`, params)
      .then((result) => result.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${CommentEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${CommentEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${CommentEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${CommentEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
