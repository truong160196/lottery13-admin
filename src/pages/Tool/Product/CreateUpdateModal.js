import React, { useEffect, useMemo, useState } from "react";
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
  get,
  Select,
  Switch,
  Row,
  Col,
} from "remix-dls";
import i18next from "i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UploadCustom from "_common/component/UploadCustom";
import { ProductApi } from "states/api/product";

export default function CreateUpdateModal({ visible, onClose, onRefreshData, detail, requests }) {
  const [form] = Form.useForm();
  const [images, setListImages] = useState([]);

  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
    });

    const avatarUrl = detail?.avatar_url;
    setListImages([
      {
        url: avatarUrl,
      },
    ]);
  }, [form, detail]);


  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...requests, ...variables, type: "event" };
      if (detail?.id) {
        return ProductApi.update({ id: detail?.id, params: newValues });
      }

      return ProductApi.create({ params: newValues });
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
        const errorMessage = error?.message ?? "Vui lòng thử lại";
        message.error(errorMessage);
      },
    }
  );

  const handleCancel = () => {
    onClose(false);
    form.resetFields();
  };

  const handleReceiveImg = (images) => {
    form.setFieldsValue({
      avatar: get(images[0], "url"),
    });
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={detail?.id ? "Cập nhật phần quà" : "Thêm mới phần quà"}
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
      <Spin tip="Loading..." spinning={isLoading}>
        <Form
          layout="vertical"
          className="form-cms"
          style={{ marginTop: 0 }}
          onFinish={mutate}
          initialValues={{
            type: "product",
          }}
          form={form}
        >
              <Form.Item
                label="Nhập tên phần quà"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên phần quà",
                  },
                ]}
              >
                <Input placeholder="Nhập giá trị phần quà" />
              </Form.Item>
              <Form.Item name="price" label="Nhập giá trị phần quà">
                <InputNumber
                  min={1}
                  placeholder="Nhập giá trị phần quà"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                />
              </Form.Item>
              <Form.Item name="description" label="Mô tả phần quà">
                <TextArea autoSize={{ minRows: 3 }} placeholder="Mô tả phần quà" />
              </Form.Item>
              <Form.Item name="avatar" label="Hình đại diện">
                <UploadCustom
                  fileList={images}
                  onReceiveImages={handleReceiveImg}
                  multiple={false}
                  maxImages={1}
                  folder="product"
                />
              </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
