import React, { useEffect, useMemo, useState } from "react";
import { Dropdown, formatDate, get, Menu, message, Modal } from "remix-dls";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExcel,
  faFilePdf,
  faFileImage,
  faFile,
  faUser,
  faFileWord,
  faEllipsis,
  faEye,
  faDownload,
  faEdit,
  faTrash,
  faFileZipper,
  faFileVideo,
  faFileCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { checkFileType, formatFileSize } from "_common/utils/FileHelper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AttachmentApi } from "states/api/attachment";

import classNames from "classnames";

import ModalRename from "./ModalRename";
import ModalPreview from "./ModalPreview";
import Account from "../Account";

export default function FIleItem({
  item,
  control,
  object_type,
  object_id,
  show_info = false,
  show_icon = true,
  onDelete = null,
}) {
  const queryClient = useQueryClient();
  const [openRename, setOpenRename] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const file_name = get(item, "file_name");

  const file_type = useMemo(() => {
    return checkFileType(file_name);
  }, [file_name]);

  const renderFIleIcon = useMemo(() => {
    switch (file_type) {
      case "excel":
        return faFileExcel;
      case "pdf":
        return faFilePdf;
      case "word":
        return faFileWord;
      case "image":
        return faFileImage;
      case "zip":
        return faFileZipper;
      case "audio":
        return faFileVideo;
      case "other":
        return faFileCircleExclamation;

      default:
        return faFile;
    }
  }, [file_type]);

  const { mutate: onDeleteSubmit } = useMutation(
    (id) => {
      return AttachmentApi.delete({ id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["attachment", "list", object_id, 1], {
          refetchType: "all",
        });
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: onDownloadSubmit } = useMutation(
    (id) => {
      return AttachmentApi.download({ id });
    },
    {
      onSuccess: (res) => {
        // queryClient.invalidateQueries(["category", "list"]);
        message.success(res?.msg || "Thao tác thành công");
        const url = res?.data?.src;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${item?.file_name}`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleDeleteFile = () => {
    if (typeof onDelete === "function") {
      onDelete(item?.delete_id || item?.id);
      return;
    }
    onDeleteSubmit(item?.id);
  };

  const handleDownloadFile = () => {
    if (!item?.file_path) return message.error("Không tìm thấy file đính kèm");
    onDownloadSubmit(item?.id);
    return null;
  };

  const menus = (
    <Menu className="small-menu">
      {control?.preview && (
        <Menu.Item key="1" onClick={() => setOpenPreview(true)}>
          <FontAwesomeIcon icon={faEye} />
          {get(control, "preview.label", "Xem trước")}
        </Menu.Item>
      )}
      {control?.download && (
        <Menu.Item key="2" onClick={() => handleDownloadFile()}>
          <FontAwesomeIcon icon={faDownload} />

          {get(control, "download.label", "Tải về")}
        </Menu.Item>
      )}
      {control?.rename && (
        <Menu.Item key="3" onClick={() => setOpenRename(true)}>
          <FontAwesomeIcon icon={faEdit} />
          {get(control, "rename.label", "Đổi tên file")}
        </Menu.Item>
      )}
      {control?.remove && (
        <Menu.Item
          key="4"
          onClick={() => {
            Modal.confirm({
              title: "Xác nhận xoá file",
              cancelText: "Huỷ",
              okText: "Xoá",
              onOk: () => handleDeleteFile(),
              content: (
                <>
                  <p>
                    Bạn có chắc chắn muốn xoá file <b>{item?.file_name}</b>{" "}
                    không?
                  </p>
                </>
              ),
            });
          }}
        >
          <FontAwesomeIcon icon={faTrash} />

          {get(control, "remove.label", "Xoá file")}
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <div
        onDoubleClick={() => {
          if (!control?.preview) return;
          setOpenPreview(true);
        }}
        className={classNames("item center", { [file_type]: true })}
      >
        {show_icon && (
          <FontAwesomeIcon
            icon={renderFIleIcon}
            onMouseUp={() => {
              if (!control?.preview) return;
              setOpenPreview(true);
            }}
          />
        )}

        <div
          className={classNames("info", { "full-title": !show_icon })}
          title={item?.file_name}
        >
          <h5 className="xdot">{item?.file_name}</h5>
          {item?.sub_title && <p>{item?.sub_title}</p>}
          {show_info ? (
            <p>
              <span>{formatFileSize(item?.file_size)}</span>
              <span>{formatDate(item?.created_at)}</span>
            </p>
          ) : (
            <p>
              <Account
                image_url={item?.created_by?.avatar_url}
                image={item?.created_by?.avatar}
                full_name={item?.created_by?.full_name}
              />
            </p>
          )}
        </div>
        <div className="small-control">
          {control?.preview && (
            <Dropdown className="btn-action" overlay={menus}>
              <FontAwesomeIcon icon={faEllipsis} />
            </Dropdown>
          )}
        </div>
      </div>
      {openRename && (
        <ModalRename
          visible={openRename}
          item={item}
          object_id={object_id}
          object_type={object_type}
          onCLose={() => setOpenRename(false)}
        />
      )}

      {openPreview && (
        <ModalPreview
          visible={openPreview}
          id={item?.id}
          file_name={item?.file_name}
          onCLose={() => setOpenPreview(false)}
        />
      )}
    </>
  );
}
