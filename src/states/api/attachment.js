import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const AttachmentEndpoint = `${endpoint}/manager/common/attachments`;

export const AttachmentApi = {
  getList: async ({ params }) =>
    await api
      .get(`${AttachmentEndpoint}/list`, params)
      .then((result) => result.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${AttachmentEndpoint}/detail/${id}`)
      .then((result) => result.data?.data),
  create: async ({ params }) =>
    await api
      .post(`${AttachmentEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${AttachmentEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${AttachmentEndpoint}/delete/${id}`)
      .then((result) => result.data),
  download: async ({ id }) =>
    await api
      .post(`${AttachmentEndpoint}/download/${id}`)
      .then((result) => result.data),
};
