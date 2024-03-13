import React, { useEffect } from "react";
import moment from "moment";
import { Button, Spin, Form, Modal, message } from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";

import FormData from "./FormData";
import { useSearchParams } from "react-router-dom";
import { useNotify } from "_common/component/NotifyProvider";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const { pushNotify } = useNotify();
  const [searchParams] = useSearchParams();
  const sale_id = searchParams.get("sale_id");
  const position_key = searchParams.get("position_key");

  const [form] = Form.useForm();
  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
      birthday: detail?.birthday && moment(detail?.birthday),
      identify_date: detail?.identify_date && moment(detail?.identify_date),
    });
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = {
        ...requests,
        ...variables,
        sale_id,
        position_request: position_key,
      };
      if (detail?.id) {
        return UserApi.update({ id: detail?.id, params: newValues });
      }

      return UserApi.create({ params: newValues });
    },
    {
      onSuccess: (res) => {
        onClose();
        if (typeof onRefreshData === "function") {
          onRefreshData();
        }
        pushNotify({
          type: "update_user",
        });
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleCancel = () => {
    onClose(false);
    form.resetFields();
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={detail?.id ? "Cập nhật người dùng" : "Tạo mới người dùng"}
      onCancel={() => handleCancel()}
      maskClosable={false}
      footer={[
        <>
          <Button className="btn-default" onClick={() => handleCancel()}>
            Hủy
          </Button>
          <Button className="btn-success" onClick={() => form.submit()}>
            Lưu
          </Button>
        </>,
      ]}
    >
      <Spin tip="Loading" spinning={isLoading}>
        <Form
          layout="vertical"
          className="form-cms"
          style={{ marginTop: 0 }}
          onFinish={mutate}
          initialValues={{
            position_key: "user",
            ...requests,
          }}
          form={form}
        >
          <FormData
            id={detail?.id}
            item={detail}
            position_key={requests?.position_key}
          />
        </Form>
      </Spin>
    </Modal>
  );
}
