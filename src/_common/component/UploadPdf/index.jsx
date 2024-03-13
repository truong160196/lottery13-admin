import React, { useEffect, useState } from "react";

import { message } from "remix-dls";
import Axios from "axios";
import { get, set, getLocalStorage } from "remix-dls/lib/utils";
import { endpoint } from "_common/constants";

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

const UploadPdf = ({
  fileList = [],
  disabled = false,
  typeUpload = "item",
  textDisplay = "Kéo thả file .pdf",
  onReceiveImages = (data) => {},
  onRemove = (data) => {},
  onPreview = () => {},
  object_key,
  accept = ".pdf",
  folder = null,
  mode = "edit",
  ...props
}) => {
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
    if (typeof onRemove === "function") {
      onRemove(file);
    }
  };

  const _handleUpload = async (file) => {
    const { onProgressUpdate } = props;
    const form = new FormData();
    form.append("file", file.file);
    form.append("app_id", config.appId);
    form.append("object_id", props?.object_id);
    form.append("object_key", object_key);
    form.append("folder", folder);
    form.append("secure_code", "remix");
    try {
      const authToken = getLocalStorage("remix_cms_token");
      const deviceCode = getLocalStorage("remix_device_init");
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
        handleRemove={() => setFileListState([])}
        typeUpload={typeUpload}
        onPreview={onPreview}
        textDisplay={textDisplay}
        object_key={object_key}
        object_id={props?.object_id}
        file={props?.maxImages === 1 ? fileListState[0] : null}
        accept={accept}
        mode={mode}
        {...props}
      />
    </div>
  );
};

export default UploadPdf;
