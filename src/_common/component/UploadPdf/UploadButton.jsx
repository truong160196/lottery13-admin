import React, { useState } from "react";
import {
  Button,
  Dropdown,
  Empty,
  Menu,
  message,
  Spin,
  Upload,
} from "remix-dls";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faEllipsis,
  faUpload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import AttachmentActions from "pages/Common/_redux/actions/attachment";
import AttachmentSelectors from "pages/Common/_redux/selectors/attachment";

import ModalPreview from "../Attachment/ModalPreview";

const UploadButtonUI = ({ textDisplay, file_url, file_name, mode }) => {
  if (mode === "view" && !file_url) {
    return (
      <div className="item-file">
        <Empty description="Không thể tải file hiện thị" />
      </div>
    );
  }
  return (
    <div className="item-file">
      {file_url ? (
        <>
          <object
            title={file_name}
            data={`${file_url}#page=1&zoom=85`}
            type="application/pdf"
          >
            <Empty description="Không thể tải file hiện thị" />
          </object>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faFilePdf} />
          <p>{textDisplay}</p>
        </>
      )}
    </div>
  );
};

const UploadButton = ({
  fileList = [],
  onPreview,
  listType = "picture-card",
  onChange,
  maxImages,
  onUpload,
  disabled,
  onRemove,
  typeUpload,
  textDisplay,
  object_key,
  object_id,
  handleRemove,
  file,
  accept,
  mode,
}) => {
  const dispatch = useDispatch();
  const [openPreview, setModalPreview] = useState(false);
  const dataState = useSelector(AttachmentSelectors.getState);

  const _renderUploadButton = () => {
    return (
      <UploadButtonUI
        textDisplay={textDisplay}
        file_url={file?.url}
        file_name={file?.name}
        mode={mode}
      />
    );
  };

  const handleOpenPreview = () => {
    if (!file?.id) return message.error("Không tìm thấy file đính kèm");
    return setModalPreview(true);
  };

  const handleDeleteFile = () => {
    if (!file?.id) return message.error("Không tìm thấy file đính kèm");
    dispatch(
      AttachmentActions.onDelete({
        id: file?.id,
        params: {
          object_id,
          object_type: object_key,
        },
        filters: {
          type_api: "upload_pdf",
        },
        callback: () => {
          if (typeof handleRemove === "function") {
            handleRemove();
          }
        },
      })
    );

    return null;
  };

  const handleDownloadFile = () => {
    if (!file?.id) return message.error("Không tìm thấy file đính kèm");
    dispatch(
      AttachmentActions.onDownload({
        id: file?.id,
        params: {
          object_id,
          object_type: object_key,
        },
        filters: {
          type_api: "upload_pdf",
        },
        callback: (data) => {
          const url = data?.src;
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${file?.name}`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        },
      })
    );
    return null;
  };

  const handleOpenNewTab = () => {
    if (!file?.url) return message.error("Không tìm thấy file đính kèm");
    window.open(file?.url, "_blank");
    return null;
  };

  const handleUploadNewFile = () => {
    document.getElementById("upload_pdf").click();
  };

  const menusDown = (
    <Menu className="action-menu">
      <Menu.Item key="1" onClick={handleOpenNewTab}>
        Xem trong tab mới
      </Menu.Item>
      <Menu.Item key="2" onClick={handleDownloadFile}>
        Tải Xuống
      </Menu.Item>
      {mode === "edit" && (
        <>
          <Menu.Divider />
          <Menu.Item key="5" className="text-danger" onClick={handleDeleteFile}>
            Xóa file
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  return (
    <Spin tip="loading ..." spinning={dataState?.loading}>
      {file?.id && (
        <div className="upload-header">
          <h4 className="xdot">{file?.name}</h4>
          <div className="action">
            {mode === "edit" && (
              <Button onClick={() => handleUploadNewFile()} title="Tải lên">
                <FontAwesomeIcon icon={faUpload} />
                Tải lên
              </Button>
            )}

            <Button title="Xem trước" onClick={() => handleOpenPreview()}>
              <FontAwesomeIcon icon={faEye} />
              Xem trước
            </Button>
            <Dropdown className="btn-action" overlay={menusDown}>
              <Button className="btn-more">
                <FontAwesomeIcon icon={faEllipsis} />
              </Button>
            </Dropdown>
          </div>
        </div>
      )}
      <Upload
        className={classnames("upload-pdf-container")}
        disabled={mode !== "edit" || disabled}
        name="image"
        customRequest={onUpload}
        fileList={maxImages > 1 ? fileList : []}
        // @ts-ignore
        listType={listType}
        onPreview={onPreview}
        onChange={onChange}
        onRemove={onRemove}
        maxCount={maxImages}
        accept={accept}
        id="upload_pdf"
      >
        {!disabled && _renderUploadButton()}
      </Upload>
      {openPreview && (
        <ModalPreview
          visible={openPreview}
          id={file?.id}
          onCLose={() => setModalPreview(false)}
        />
      )}
    </Spin>
  );
};

export default UploadButton;
