import React, { useEffect, useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faReply,
  faTrash,
  faComment,
  faThumbsUp,
  faPaperclip,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames";
import { Button, Dropdown, formatDate, Menu, message, Modal } from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentApi } from "states/api";
import { useStores } from "_common/hooks";
import FIleItem from "../Attachment/FIleItem";
import FormReply from "./FormReply";

export default function Item({
  item,
  type = "item",
  object_type,
  object_id,
  onGetList,
}) {
  const queryClient = useQueryClient();
  const {
    authStore: { isAdmin },
  } = useStores();

  const [is_reply, setIsReply] = useState(false);

  const { mutate: onDelete } = useMutation(
    () => {
      return CommentApi.delete({ id: item?.id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["comment", "list", object_id, 1]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleDeleteRow = () => {
    Modal.confirm({
      title: "Xác nhận xoá đơn hàng",
      cancelText: "Huỷ",
      okText: "Xoá",
      onOk: () => {
        onDelete();
      },
      content: (
        <>
          <p>Bạn có chắc chắn muốn xoá bình luận này không</p>
        </>
      ),
    });

    return null;
  };

  const menus = (
    <Menu className="small-menu">
      <Menu.Item key="4" onClick={() => handleDeleteRow()}>
        <FontAwesomeIcon icon={faTrash} />
        Xoá
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={classNames("item comment-item")}>
      <img
        className={classNames("avatar", {
          "avatar-sm": type === "child",
        })}
        src={item?.created_by?.avatar_url}
        alt={item?.created_by?.full_name}
      />
      <div className="info">
        <div onClick={() => setIsReply(false)}>
          <h4 className="account-title">
            <span className="full-name">{item?.created_by?.full_name}</span>
            {item?.type && type === "item" ? (
              <span className="time">
                {item?.type} <b>{item?.title}</b>
              </span>
            ) : (
              <span className="time">
                {item?.created_at &&
                  formatDate(item?.created_at, "DD/MM/YYYY HH:mm:ss")}
              </span>
            )}
          </h4>
          {type === "item" && (
            <p>
              <span className="time">
                {item?.created_at &&
                  formatDate(item?.created_at, "DD/MM/YYYY HH:mm:ss")}
              </span>
            </p>
          )}

          <p className="message">{item?.content}</p>
          {item?.media && (
            <div className="file-attachment">
              <FIleItem
                item={item?.media}
                object_id={object_id}
                object_type={object_type}
                control={{
                  preview: true,
                  download: true,
                  remove: false,
                  rename: false,
                }}
                show_info
              />
            </div>
          )}
          <div className="list-comment-child">
            {item?.children?.map((obj, idx) => {
              return (
                <Item
                  object_id={object_id}
                  object_type={object_type}
                  item={obj}
                  key={`item-file-${idx.toString()}`}
                  onGetList={onGetList}
                  type="child"
                />
              );
            })}
          </div>
        </div>
        {item?.allow_reply === 1 && (
          <>
            {!is_reply && type === "item" && (
              <div className="info-footer">
                <Button className="btn-reply" onClick={() => setIsReply(true)}>
                  <FontAwesomeIcon icon={faReply} />
                  <span>Trả lời</span>
                </Button>
                <div className="like">
                  {/* <span>
                    <FontAwesomeIcon icon={faComment} />
                    {item?.count_comment}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    {item?.count_like}
                  </span> */}
                </div>
              </div>
            )}

            {is_reply && (
              <FormReply
                object_id={object_id}
                object_type={object_type}
                item={item}
                handleCallback={() => {
                  setIsReply(false);
                  if (typeof onGetList === "function") {
                    onGetList();
                  }
                }}
              />
            )}
          </>
        )}
      </div>
      {isAdmin && (
        <div className="small-control">
          <Dropdown className="btn-action" overlay={menus}>
            <FontAwesomeIcon icon={faEllipsis} />
          </Dropdown>
        </div>
      )}
    </div>
  );
}
