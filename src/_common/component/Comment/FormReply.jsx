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
import {
  Button,
  Dropdown,
  formatDate,
  Menu,
  message,
  Spin,
  TextArea,
  Upload,
} from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentApi } from "states/api";
import FIleItem from "../Attachment/FIleItem";
import UploadAttachment from "../Attachment/UploadAttachment";

export default function FormReply({
  object_type,
  object_id,
  item,
  handleCallback,
}) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState("");
  const [media_id, setMediaId] = useState("");

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = {
        ...variables,
        parent_id: item?.id,
        object_type,
        object_id,
      };
      return CommentApi.create({ params: newValues });
    },
    {
      onSuccess: (res) => {
        if (typeof handleCallback === "function") {
          handleCallback();
        }

        if (media_id) {
          queryClient.invalidateQueries(["attachment", "list", object_id, 1]);
        }
        setMediaId("");
        setValue("");
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleSubmit = () => {
    mutate({ content: value, media_id });
  };

  const handleReceiveFile = (images) => {
    setMediaId(images?.icon_image?.id);
  };

  return (
    <div className="reply-container">
      <Spin spinning={isLoading} tip="loading....">
        <TextArea
          autoSize
          placeholder="Viết bình luận của bạn"
          onChange={(e) => setValue(e?.target?.value)}
        />
        <div className="control">
          <UploadAttachment
            object_type="order"
            folder="order"
            className="comment-container"
            onReceive={handleReceiveFile}
          >
            <Button className="btn-upload">
              <FontAwesomeIcon icon={faPaperclip} />
              <span> Đính kèm</span>
            </Button>
          </UploadAttachment>
          <Button className="btn-send" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faPaperPlane} />
            <span>Gửi</span>
          </Button>
        </div>
      </Spin>
    </div>
  );
}
