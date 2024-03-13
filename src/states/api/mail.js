import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const MailEndpoint = `${endpoint}/manager/common/mail`;

export const MailApi = {
  getList: async ({ params }) =>
    await api
      .get(`${MailEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${MailEndpoint}/detail/${id}`)
      .then((result) => result.data?.data),
  sendMail: async ({ params }) =>
    await api
      .post(`${MailEndpoint}/send`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${MailEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
