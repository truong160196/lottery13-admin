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
import { giftStatusText } from "_common/constants/statusType";
import { GiftApi } from "states/api/gift";
import { useStores } from "_common/hooks";

export default function CreateUpdateModal({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const [form] = Form.useForm();
  const {
    authStore: { products },
  } = useStores();

  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
    });
  }, [form, products, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const product = products.find(
        (item) => item.id === variables?.product_id
      );
      const newValues = {
        ...requests,
        ...variables,
        product_name: product?.name,
        product_image: product?.image,
      };
      if (detail?.id) {
        return GiftApi.update({ id: detail?.id, params: newValues });
      }

      return GiftApi.create({ params: newValues });
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

  const productOption = useMemo(() => {
    return products?.map((item) => ({
      value: item?.id,
      label: item?.name,
    }));
  }, [products]);

  useEffect(() => {
    if (!productOption?.length) return;
    if (detail?.id) return;
    form.setFieldsValue({
      product_id: get(productOption[0], "value"),
    });
  }, [productOption, detail]);

  const handleCancel = () => {
    onClose(false);
    form.resetFields();
  };

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
            status: "ready",
          }}
          form={form}
        >
          <Form.Item name="product_id" label="Sản phẩm">
            <Select
              showSearch
              placeholder="Chọn quà tặng"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              options={productOption}
            />
          </Form.Item>
          <Form.Item name="created_by" label="Người dùng">
            <SelectSale placeholder="Chọn người dùng" sourceKey="user" />
          </Form.Item>
          <Form.Item name="final_total" label="Giá trị quà tặng">
            <InputNumber
              min={1}
              placeholder="Nhập giá trị quà tặng"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
              }
              parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select placeholder="Chọn trạng thái">
              {Object.keys(giftStatusText).map((item) => (
                <Select.Option key={item} value={item}>
                  {giftStatusText[item]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
