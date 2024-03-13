import React, { useEffect, useState } from "react";

import { message } from "remix-dls";
import Axios from "axios";
import { get, set, getLocalStorage } from "remix-dls/lib/utils";
import { endpoint } from "_common/constants/common";
import { useStores } from "_common/hooks";

import UploadButton from "./UploadButton";

export const config = {
  google: {
    clientID: "",
    keyGMap: "",
  },
  fbConfig: {
    appId: "",
    version: "v1.0",
  },
  hasHeader: false,
  hasMobile: true,
  templates: ["remix"],
  languages: ["vn"],
  app: {},
  uploadKey: "9074c259a7",
  appId: "2",
};

const UploadCustom = ({
  fileList = [],
  disabled = false,
  typeUpload = "item",
  textDisplay,
  onReceiveImages = (data) => {},
  onRemove = (data) => {},
  onPreview = () => {},
  ...props
}) => {
  const { authStore } = useStores();
  const [fileListState, setFileListState] = useState([]);

  useEffect(() => {
    setFileListState(fileList);
  }, [fileList]);

  const _handleChange = (e) => {
    console.log("e", e);
    if (!props?.multiple) {
      setFileListState(e.file && e.file.status !== "removed" ? [e.file] : []);
      if (typeof onReceiveImages === "function") {
        onReceiveImages(fileListState);
      }
      return;
    }

    setFileListState(e.fileList);

    if (typeof onReceiveImages === "function") {
      onReceiveImages(e.fileList);
    }
  };

  const handleSuccess = ({ url, id, file }) => {
    const newImage = {
      isNew: true,
      id,
      uid: get(file, "uid"),
      name: get(file, "name"),
      status: "done",
      url,
    };
    const dataImages = [...fileListState];
    const checkIndex = dataImages.findIndex((i) => i.uid === file.uid);
    set(dataImages, `[${checkIndex > -1 ? checkIndex : 0}]`, newImage);

    setFileListState(dataImages);
    if (typeof onReceiveImages === "function") {
      onReceiveImages(dataImages);
    }
  };

  const handleUploadFailed = (res) => {
    console.log("upload failed", res);

    const { file } = res;
    const data = [...fileListState];
    const index = data.findIndex((i) => i.uid === file.uid);
    data.splice(index, 1);

    setFileListState(data);
  };

  const _handleRemove = (file) => {
    if (typeof onRemove === "function") {
      onRemove(file);
    }
  };

  const _handleUpload = async (file) => {
    const { onProgressUpdate } = props;
    const form = new FormData();
    form.append("file", file.file);
    form.append("app_id", config.appId);
    form.append("uid", file?.file?.uid);
    form.append("folder", props?.folder);
    form.append("secure_code", "remix");

    const authToken = authStore.token;
    const deviceCode = authStore.device;

    const headers = {};
    try {
      if (deviceCode) {
        headers["device-code"] = deviceCode;
      }

      if (authToken) {
        headers.authorization = `Bearer ${authToken}`;
      }

      const result = await Axios({
        method: "POST",
        url: `${endpoint}/file/upload`,
        data: form,
        headers,
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
      if (get(result, "data.code") !== 200)
        throw new Error(get(result, "data.msg"));
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
    <div className="upload-custom">
      <UploadButton
        maxImages={props?.maxImages}
        disabled={disabled}
        fileList={fileListState}
        onUpload={_handleUpload}
        onChange={_handleChange}
        onRemove={_handleRemove}
        typeUpload={typeUpload}
        onPreview={onPreview}
        textDisplay={textDisplay}
        imgSrc={props?.maxImages === 1 ? fileListState[0]?.url : null}
        {...props}
      />
    </div>
  );
};

export default UploadCustom;
