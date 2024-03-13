import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, DatePicker, Form, Input, Modal } from "remix-dls";

const Filter = ({ visible, onCLose }) => {
  const [form] = Form.useForm();

  const handleClose = () => {
    onCLose();
    form.resetFields();
  };

  const handleFilterSubmit = (values) => {
    console.log("values", values);
    handleClose();
  };

  return (
    <>
      <Modal
        className="remix-modal-form"
        visible={visible}
        width={450}
        onCancel={handleClose}
        footer={[
          <>
            <Button className="btn-default" onClick={() => handleClose()}>
              Huỷ
            </Button>
            <Button className="btn-info" onClick={() => form.submit()}>
              Tìm kiếm
            </Button>
          </>,
        ]}
      >
        <div className="remix-drawer-title">
          <h3>Tìm kiếm</h3>
        </div>
        <Form
          form={form}
          layout="vertical"
          className="remix-form-cms"
          onFinish={handleFilterSubmit}
        >
          <Form.Item name="file_name" label="Tên file">
            <Input placeholder="Tên file" />
          </Form.Item>
          <Form.Item name="start_date" label="Từ ngày">
            <DatePicker placeholder="Từ ngày" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="end_date" label="Đến ngày">
            <DatePicker placeholder="Đến ngày" format="DD/MM/YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Filter;
