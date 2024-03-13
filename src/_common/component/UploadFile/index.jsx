import Axios from "axios";
import React, { useEffect, useState } from "react";

import { get, getLocalStorage, message, set, Upload } from "remix-dls";
import { endpoint, config } from "_common/constants/common";
import { useStores } from "_common/hooks";

export default function UploadFile({ fileList, onReceiveImages, ...props }) {
  const { authStore } = useStores();

  const [fileListState, setFileListState] = useState([]);

  useEffect(() => {
    if (!fileList) return;
    setFileListState(fileList);
  }, [fileList]);

  const _handleChange = (e) => {
    if (!props?.multiple) {
      const dataImages = [
        ...fileListState,
        ...e.fileList?.map((item) => ({ ...item, status: "done" })),
      ];
      setFileListState(dataImages);
      if (typeof onReceiveImages === "function") {
        onReceiveImages(dataImages);
      }
      return;
    }

    setFileListState(e.fileList);

    if (typeof onReceiveImages === "function") {
      onReceiveImages(e.fileList);
    }
  };

  const handleSuccess = ({ url, file, id }) => {
    const newImage = {
      isNew: true,
      id,
      uid: get(file, "uid"),
      name: get(file, "name"),
      status: "done",
      url,
    };
    const dataImages = [...fileListState];
    set(
      dataImages,
      `[${dataImages.findIndex((i) => i.uid === file.uid)}]`,
      newImage
    );

    setFileListState(dataImages);
    if (typeof onReceiveImages === "function") {
      onReceiveImages(dataImages);
    }
  };

  const handleUploadFailed = (res) => {
    const { file } = res;
    const data = [...fileListState];
    const index = data.findIndex((i) => i.uid === file.uid);
    data.splice(index, 1);

    setFileListState(data);
  };

  const _handleRemove = (file) => {
    if (typeof props?.onRemove === "function") {
      props.onRemove(file);
    }
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
    if (props?.description) {
      form.append("description", props?.description);
    }
    try {
      const authToken = authStore.token;
      const deviceCode = authStore.device;
      const result = await Axios({
        method: "POST",
        url: `${endpoint}/file/upload`,
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
        url: get(result, "data.data.thumb"),
        id: get(result, "data.data.id"),
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
      fileList={fileListState}
      customRequest={_handleUpload}
      onChange={_handleChange}
      onRemove={_handleRemove}
      {...props}
    />
  );
}
