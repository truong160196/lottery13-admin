import React, { useEffect } from "react";
import { Button, Spin, Form, Modal, message, Input, TextArea } from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomerApi, MailApi } from "states/api";
import classNames from "classnames";

import { get } from "lodash";
import FIleItem from "../Attachment/FIleItem";

export default function ModalSendMail({
  visible,
  listFile = [],
  onClose,
  detail,
}) {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({ ...detail });
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables };
      if (listFile?.length > 0) {
        newValues.attachments = listFile.map((item) => item?.file_path);
      }
      return MailApi.sendMail({ params: newValues });
    },
    {
      onSuccess: (res) => {
        onClose();
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
      visible={visible}
      title="GửI mail"
      onCancel={() => handleCancel()}
      className={window.innerWidth <= 568 && "remix-modal-form modal-full"}
      maskClosable={false}
      closable={false}
      footer={[
        <>
          <Button
            disabled={isLoading}
            className="btn-default"
            onClick={() => handleCancel()}
          >
            Hủy
          </Button>
          <Button
            disabled={isLoading}
            className="btn-success"
            onClick={() => form.submit()}
          >
            Gửi
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
          initialValues={{}}
          form={form}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                email: "Nhập email cần gửi",
              },
            ]}
          >
            <Input type="email" placeholder="Nhập email" />
          </Form.Item>
          <Form.Item name="description" label="Lời nhắn">
            <TextArea
              autoSize={{ minRows: 4 }}
              placeholder="Nhập nội dung lời nhắn"
            />
          </Form.Item>
          <Form.Item>
            <div
              className={classNames("list-file", {
                "list-file-col": listFile?.length > 1,
              })}
            >
              {listFile?.map((item, idx) => {
                return (
                  <FIleItem
                    item={item}
                    key={`item-file-${idx.toString()}`}
                    control={{
                      preview: true,
                      download: false,
                      remove: false,
                      rename: false,
                    }}
                    show_info
                  />
                );
              })}
            </div>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
