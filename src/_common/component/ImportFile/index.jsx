import Axios from "axios";
import React, { useEffect, useState } from "react";

import { get, getLocalStorage, message, set, Upload } from "remix-dls";
import { endpoint, config } from "_common/constants/common";
import { useStores } from "_common/hooks";

export default function ImportFile({ onReceiveImages, ...props }) {
  const { authStore } = useStores();

  const handleSuccess = ({ data, file }) => {
    if (typeof onReceiveImages === "function") {
      onReceiveImages(data);
    }
  };

  const handleUploadFailed = (res) => {
    //
  };

  const _handleUpload = async (file) => {
    const { onProgressUpdate } = props;
    const form = new FormData();
    form.append("file", file.file);
    form.append("app_id", config.appId);
    form.append("secure_code", "remix");
    if (props?.folder) {
      form.append("folder", props?.folder);
    }
    if (props?.object_id) {
      form.append("object_id", props?.object_id);
    }
    if (props?.object_key) {
      form.append("object_key", props?.object_key);
    }

    try {
      const authToken = authStore.token;
      const deviceCode = authStore.device;
      const result = await Axios({
        method: "POST",
        url: `${endpoint}/file/import`,
        data: form,
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : "",
          "device-code": deviceCode,
        },
        onUploadProgress(progressEvent) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgressUpdate) {
            onProgressUpdate({
              percent: percentCompleted,
              file: file.file,
            });
          }
        },
      });
      if (get(result, "data.code") !== 200) {
        throw new Error(get(result, "data.msg"));
      }
      handleSuccess({
        file: get(file, "file"),
        data: get(result, "data.data"),
      });
    } catch (error) {
      message.error(error?.message || "Tải file lên thất bại!");
      if (handleUploadFailed) {
        handleUploadFailed({ file });
      }
    }
  };

  return (
    <Upload
      fileList={[]}
      customRequest={_handleUpload}
      showUploadList={false}
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      {...props}
    />
  );
}
