import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Spin, Form, Modal, message, get } from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VipApi } from "states/api";

import FormData from "./FormData";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
}) {
  const [form] = Form.useForm();
  const [logoImage, setLogoImage] = useState([]);

  useEffect(() => {
    if (!form) return;
    const newsValue = { ...detail };
    const imageData = get(detail, "image_url", "");
    setLogoImage([
      {
        url: imageData,
      },
    ]);

    form.setFieldsValue(newsValue);
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables };
      if (detail?.id) {
        return VipApi.update({ id: detail?.id, params: newValues });
      }

      return VipApi.create({ params: newValues });
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

  const handleImageLogo = (images) => {
    form.setFieldsValue({
      logo: get(images[0], "url"),
    });
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={detail?.id ? "Cập nhật chức danh" : "Tạo mới chức danh"}
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
          initialValues={{}}
          form={form}
        >
          <FormData
            id={detail?.id}
            handleImageLogo={handleImageLogo}
            logoImage={logoImage}
          />
        </Form>
      </Spin>
    </Modal>
  );
}
