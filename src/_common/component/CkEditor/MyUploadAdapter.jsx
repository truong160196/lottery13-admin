/* eslint-disable consistent-return */
/* eslint-disable no-multi-assign */
/* eslint-disable class-methods-use-this */

import { getLocalStorage } from "remix-dls";
import { config, LocalStorage } from "_common/constants";

/* eslint-disable no-undef */
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  // Starts the upload process.
  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", `${config.hostFileManage}/file/ckeditor-upload`, true);
    xhr.responseType = "json";

    const authToken = getLocalStorage(LocalStorage.Token);
    let deviceCode = "";

    try {
      const device = getLocalStorage(LocalStorage.Device);
      deviceCode = device.device_code;
    } catch (error) {
      //
    }

    xhr.setRequestHeader(
      "authorization",
      authToken ? `Bearer ${authToken}` : ""
    );
    xhr.setRequestHeader("device-code", deviceCode || "remix");
  }

  _initListeners(resolve, reject, file) {
    const { xhr } = this;
    const { loader } = this;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const { response } = xhr;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      console.log("response", response);

      resolve(response.data);
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    try {
      const data = new FormData();

      data.append("upload", file);
      data.append("ckCsrfToken", "remix");

      this.xhr.send(data);
    } catch (err) {
      console.error(err);
    }
  }
}

export default MyUploadAdapter;
