import React, { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Spin } from "remix-dls";

const ModalRename = ({ visible, item, object_id, object_type, onCLose }) => {
  const [form] = Form.useForm();

  const loading = false;

  useEffect(() => {
    if (!item) return;
    form.setFieldsValue({
      ...item,
    });
  }, [item]);

  const handleClose = () => {
    onCLose();
    form.resetFields();
  };

  const handleFilterSubmit = (values) => {
    // AttachmentActions.onUpdate({
    //   id: item?.id,
    //   params: {
    //     ...values,
    //     object_id,
    //     object_type,
    //   },
    //   filters: {
    //     object_id,
    //     object_type,
    //   },
    //   callback: () => {
    //     handleClose();
    //   },
    // })
  };

  return (
    <>
      <Modal
        className="remix-modal-form"
        visible={visible}
        width={450}
        onCancel={handleClose}
        title="Đổi tên file"
        maskClosable={false}
        footer={[
          <>
            <Button
              disabled={loading}
              className="btn-default"
              onClick={() => handleClose()}
            >
              Huỷ
            </Button>
            <Button
              disabled={loading}
              className="btn-info"
              onClick={() => form.submit()}
            >
              Lưu
            </Button>
          </>,
        ]}
      >
        <Spin tip="Loading ..." spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            className="remix-form-cms"
            onFinish={handleFilterSubmit}
          >
            <Form.Item name="file_name" label="Tên file">
              <Input placeholder="Tên file" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalRename;
