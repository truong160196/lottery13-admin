import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const EmployeeEndpoint = `${endpoint}/manager/employee`;

export const EmployeeApi = {
  getList: async ({ params }) =>
    await api
      .get(`${EmployeeEndpoint}/list`, params)
      .then((result) => result.data?.data),
  getDetail: async ({ id }) =>
    await api
      .get(`${EmployeeEndpoint}/detail/${id}`)
      .then((result) => result.data),
  create: async ({ params }) =>
    await api
      .post(`${EmployeeEndpoint}/create`, params)
      .then((result) => result.data),
  update: async ({ id, params }) =>
    await api
      .put(`${EmployeeEndpoint}/update/${id}`, params)
      .then((result) => result.data),
  delete: async ({ id }) =>
    await api
      .delete(`${EmployeeEndpoint}/delete/${id}`)
      .then((result) => result.data),
};
