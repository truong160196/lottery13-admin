import React, { useEffect } from "react";
import moment from "moment";
import {
  Button,
  Spin,
  Form,
  Modal,
  message,
  Input,
  InputNumber,
  TextArea,
  Select,
} from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationApi } from "states/api/notification";
import { optionBank } from "_common/constants/bank";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
    });
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = {
        ...requests,
        ...variables,
      };
      if (detail?.id) {
        return NotificationApi.update({ id: detail?.id, params: newValues });
      }

      return NotificationApi.create({ params: newValues });
    },
    {
      onSuccess: (res) => {
        onClose();
        if (typeof onRefreshData === "function") {
          onRefreshData();
        }
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
      title={detail?.id ? "Cập nhật thông báo" : "Tạo mới thông báo"}
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
      <Spin spinning={isLoading} tip="Đang tải...">
        <Form
          layout="vertical"
          className="form-cms"
          style={{ marginTop: 0 }}
          onFinish={mutate}
          initialValues={{}}
          form={form}
        >
          <Form.Item name="title" label="Tiêu đề">
            <Input placeholder="Tiêu đề" />
          </Form.Item>
          <Form.Item name="content" label="Nội dung">
            <TextArea autoSize={{ minRows: 5 }} placeholder="Nội dung" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
