import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  TextArea,
} from "remix-dls";
import { UserApi } from "states/api";
import { BankApi } from "states/api/bank";
import SelectSale from "_common/component/SelectSale";
import { optionBank } from "_common/constants/bank";
import { genderText } from "_common/constants/statusType";

export default function FormData({ item, sourceKey, onRefreshData }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!item) return;
    form.setFieldsValue({ sale_id: item?.user_ref?.user_id });
  }, [item]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables };
      return UserApi.update({ id: item?.id, params: newValues });
    },
    {
      onSuccess: (res) => {
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

  return (
    <>
      <Spin spinning={isLoading} tip="Đang tải...">
        <Form
          layout="vertical"
          className="form-cms"
          style={{ marginTop: 0 }}
          onFinish={mutate}
          initialValues={{}}
          form={form}
        >
          <Form.Item label="Người dùng cấp trên" name="sale_id">
            <SelectSale
              placeholder="Chọn người dùng"
              sourceKey={sourceKey}
              defaultValue={[{ ...item?.user_ref?.user }]}
            />
          </Form.Item>
          <Form.Item>
            <Button className="btn-primary" onClick={() => form.submit()}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </>
  );
}
