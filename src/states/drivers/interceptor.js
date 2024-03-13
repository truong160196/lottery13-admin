import _ from "lodash";
import { rootStore } from "../stores";

export const _requestHeader = (config) => {
  const newConfig = config;
  const authToken = rootStore.authStore.token;
  const deviceCode = rootStore.authStore.device;

  const headers = {};

  try {
    if (deviceCode) {
      headers["device-code"] = deviceCode;
    }

    if (authToken) {
      headers.authorization = `Bearer ${authToken}`;
    }

    newConfig.headers = headers;
  } catch (err) {
    console.error(err);
  }

  try {
    newConfig.params = config.params || {};
  } catch (err) {
    console.error(err);
  }

  return newConfig;
};

export const _requestResponse = (response) => {
  const status = _.get(response, "data.code");
  if (status === 200) {
    const message = _.get(response, "data.message");
    let data = _.get(response, "data");
    if (!_.isEmpty(message)) {
      data = { ...data, message: "" };
      return {
        ...response,
        data,
      };
    }
    return response;
  }

  if (status === 401) {
    rootStore.authStore.clear();
  }

  throw response;
};

export const _requestError = (err) => {
  const message =
    _.get(err, "data.msg") || _.get(err, "response.data.error.message");
  const status = _.get(err, "data.code") || _.get(err, "response.status");

  if (status === 401) {
    rootStore.authStore.clear();
  }
  const error = err;
  if (typeof message === "string") {
    error.message = message;
  } else {
    error.message = "Whoops! Something went wrong";
  }
  throw error;
};
