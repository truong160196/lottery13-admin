import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Spin, Form, Modal, message, Divider, Empty } from "remix-dls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStores } from "_common/hooks";

import FormData from "./FormData";

export default function ListBossModal({
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

  const Body = () => {
    if (!detail?.user_ref)
      return <Empty description="Không có dữ liệu cấp trên" />;

    return (
      <>
        <h5>Chi tiết cấp trên</h5>
        <table className="table-info">
          <tbody>
            <tr>
              <td>
                <b>ID</b>
              </td>
              <td>{detail?.user_ref?.user?.id}</td>
            </tr>
            <tr>
              <td>
                <b>Tên đầy đủ</b>
              </td>
              <td>{detail?.user_ref?.user?.full_name}</td>
            </tr>
            <tr>
              <td>
                <b>Biệt danh</b>
              </td>
              <td>{detail?.user_ref?.user?.nick_name}</td>
            </tr>
            <tr>
              <td>
                <b>Mã giới thiệu</b>
              </td>
              <td>{detail?.user_ref?.user?.ref_no}</td>
            </tr>
            <tr>
              <td>
                <b>Link CSKH</b>
              </td>
              <td>{detail?.user_ref?.user?.link_zalo}</td>
            </tr>
            <tr>
              <td>
                <b>Email</b>
              </td>
              <td>{detail?.user_ref?.user?.email}</td>
            </tr>
            <tr>
              <td>
                <b>Số điện thoại</b>
              </td>
              <td>{detail?.user_ref?.user?.phone}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title="Thông tin cấp trên"
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
      <Body />
      {isAdmin && (
        <>
          <Divider />
          <h5>Cập nhật thông tin cấp trên</h5>
          <FormData
            item={detail}
            onRefreshData={() => {
              onClose(false);
              onRefreshData();
            }}
          />
        </>
      )}
    </Modal>
  );
}
