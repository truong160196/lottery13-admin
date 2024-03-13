import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import {
  Button,
  Spin,
  Form,
  Modal,
  message,
  Select,
  get,
  InputNumber,
} from "remix-dls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gameStatusText, giftStatusText } from "_common/constants/statusType";
import { useStores } from "_common/hooks";
import { GamePlayerApi } from "states/api/gamePlayer";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const [form] = Form.useForm();
  const {
    authStore: { games, dice_url, item_ball, item_number },
  } = useStores();

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
      return GamePlayerApi.update({ id: detail?.id, params: newValues });
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

  const betOption = useMemo(() => {
    const dataClone = [...item_number, ...item_ball];
    return dataClone?.map((item) => ({
      value: item?.code,
      label: item?.name,
    }));
  }, [item_number, item_ball]);

  const handleCancel = () => {
    onClose(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    if (!detail.id) return message.error("Vui lòng chọn một phiên game");
    form.submit();
    return null;
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={detail?.id ? "Cập nhật đặt cược" : "Tạo mới đặt cược"}
      onCancel={() => handleCancel()}
      maskClosable={false}
      footer={[
        <>
          <Button className="btn-default" onClick={() => handleCancel()}>
            Hủy
          </Button>
          <Button className="btn-success" onClick={() => handleSubmit()}>
            {" "}
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
            status: "ready",
          }}
          form={form}
        >
          <Form.Item name="amount" label="Tiền cược">
            <InputNumber
              placeholder="Tiền cược"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="amount_payback" label="Tiền thắng">
            <InputNumber
              placeholder="Tiền cược"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              {Object.keys(gameStatusText).map((item) => (
                <Select.Option key={item} value={item}>
                  {gameStatusText[item]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
