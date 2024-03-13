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
import SelectSale from "_common/component/SelectSale";
import { LuckyApi } from "states/api/lucky";
import { useStores } from "_common/hooks";
import {
  luckyStatusOptions,
  luckyStatusText,
} from "_common/constants/statusType";
import { ProductApi } from "states/api/product";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const [form] = Form.useForm();

  const {
    authStore: { lucky },
  } = useStores();

  const { data: productState } = useQuery(
    ["product", "list"],
    () =>
      ProductApi.getList({
        params: {
          page: 1,
          limit: 100,
          type: "event",
        },
      }),
    {
      staleTime: 300000,
    }
  );

  useEffect(() => {
    if (!form) return;
    if (!detail) return;
    const data = {
      ...detail,
    };

    form.setFieldsValue(data);
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const gift = productState?.data?.find((item) => item?.id === variables?.gift_id);

      const newValues = {
        ...requests,
        ...variables,
        gift_name: gift?.name,
        gift_image: gift?.avatar_url,
      };
      if (detail?.id) {
        return LuckyApi.update({ id: detail?.id, params: newValues });
      }

      return LuckyApi.create({ params: newValues });
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

  const productOption = useMemo(() => {
    return productState?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    }));
  }, [productState]);

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={detail?.id ? "Cập nhật quà tặng" : "Tạo mới quà tặng"}
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
            status: "pending",
          }}
          form={form}
        >
          <Form.Item name="created_by" label="Người dùng">
            <SelectSale placeholder="Chọn người dùng" sourceKey="user" />
          </Form.Item>
          <Form.Item name="gift_id" label="Giá trị phần quà">
            <Select
              showSearch
              placeholder="Chọn phần quà"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={productOption}
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              {Object.keys(luckyStatusOptions).map((item) => (
                <Select.Option key={item} value={item}>
                  {luckyStatusOptions[item]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
