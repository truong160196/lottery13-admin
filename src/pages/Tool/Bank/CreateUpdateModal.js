import React, { useEffect, useState } from "react";
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
  get,
} from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SystemBankApi } from "states/api/systemBank";
import { optionBank } from "_common/constants/bank";
import UploadCustom from "_common/component/UploadCustom";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const [form] = Form.useForm();
  const [logoQRImage, setLogoQRImage] = useState([]);

  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
    });

    // logo white
    const imageDarkData = get(detail, "qr_image_url", "");
    setLogoQRImage([
      {
        url: imageDarkData,
      },
    ]);
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const bank = optionBank.find((obj) => obj.value === variables?.bank_code);

      const newValues = {
        type: "system",
        bank_name: bank?.text,
        ...requests,
        ...variables,
      };
      if (detail?.id) {
        return SystemBankApi.update({ id: detail?.id, params: newValues });
      }

      return SystemBankApi.create({ params: newValues });
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

  const handleImageQRImage = (images) => {
    form.setFieldsValue({
      qr_image: get(images[0], "url"),
    });
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={detail?.id ? "Cập nhật ngân hàng" : "Tạo mới ngân hàng"}
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
          <Form.Item label="Tên ngân hàng" name="bank_code">
            <Select placeholder="Chọn ngân hàng" style={{ width: "100%" }}>
              {optionBank.map((item) => (
                <Select.Option value={item.value}>
                  {item.text} ({item.sortName})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="bank_number" label="Số tài khoản">
            <Input placeholder="Số tài khoản" />
          </Form.Item>
          <Form.Item name="bank_owner" label="Tên chủ tài khoản">
            <Input placeholder="Tên chủ tài khoản" />
          </Form.Item>
          <Form.Item label="QR Code" name="qr_image">
            <UploadCustom
              fileList={logoQRImage}
              onReceiveImages={handleImageQRImage}
              multiple={false}
              maxImages={1}
              folder="bank"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
