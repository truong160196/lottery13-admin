import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Spin, Form, Modal, message, Divider, Empty } from "remix-dls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { BankApi } from "states/api/bank";

import FormData from "./FormData";

export default function ListBankModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({});
  const user_id = detail?.id;

  const { data, isLoading, refetch } = useQuery(
    ["bank", "list", user_id, params],
    () =>
      BankApi.getList({
        params: {
          page: 1,
          limit: 10,
          user_id,
          ...params,
        },
      }),
    {
      staleTime: 300000,
      enabled: !!user_id,
    }
  );

  const handleCancel = () => {
    onClose(false);
  };

  const Body = () => {
    if (!data?.data?.length)
      return <Empty description="Không có dữ liệu ngân hàng" />;
    return (
      <>
        {data?.data?.map((item) => {
          return (
            <div className="" key={item?.id}>
              <FormData
                item={item}
                onRefreshData={() => {
                  queryClient.invalidateQueries(["bank", "list", user_id]);
                }}
              />
              <Divider />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title="Cập nhật thông tin ngân hàng"
      onCancel={() => handleCancel()}
      maskClosable={false}
      width="90%"
      footer={[
        <>
          <Button className="btn-default" onClick={() => handleCancel()}>
            Đóng
          </Button>
        </>,
      ]}
    >
      <Spin tip="Loading" spinning={isLoading}>
        <Body />
      </Spin>
    </Modal>
  );
}
