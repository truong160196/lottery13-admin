import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Spin, Form, Modal, message, Divider, Empty } from "remix-dls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStores } from "_common/hooks";

import FormData from "./FormData";

export default function ModalAddUser({
  visible,
  onClose,
  onRefreshData,
  detail,
  sourceKey,
}) {
  const {
    authStore: { isAdmin },
  } = useStores();
  const queryClient = useQueryClient();
  const [params, setParams] = useState({});
  const user_id = detail?.id;

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title="Phân chia người dùng"
      onCancel={() => handleCancel()}
      maskClosable={false}
      footer={[
        <>
          <Button className="btn-default" onClick={() => handleCancel()}>
            Đóng
          </Button>
        </>,
      ]}
    >
      <FormData
        sourceKey="user"
        item={detail}
        onRefreshData={() => {
          onClose(false);
          onRefreshData();
        }}
      />
    </Modal>
  );
}
