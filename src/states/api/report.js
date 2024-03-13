import { endpoint } from "_common/constants/common";
import api from "states/drivers";

const ReportEndpoint = `${endpoint}/manager/report`;

export const ReportApi = {
  getStatic: async ({ params }) =>
    await api
      .get(`${ReportEndpoint}/static`, params)
      .then((result) => result.data?.data),
};
