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
import { BankApi } from "states/api/bank";
import { optionBank } from "_common/constants/bank";
import { genderText } from "_common/constants/statusType";

export default function FormData({ item, onRefreshData }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!item) return;
    form.setFieldsValue({ ...item });
  }, [item]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const bank = optionBank.find((obj) => obj.value === variables?.bank_code);

      const newValues = { ...variables, bank_name: bank?.text };
      return BankApi.update({ id: item?.id, params: newValues });
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
          <Row>
            <Col xs={24} md={8}>
              <Form.Item label="Tên ngân hàng" name="bank_code">
                <Select placeholder="Chọn ngân hàng" style={{ width: "100%" }}>
                  {optionBank.map((item) => (
                    <Select.Option value={item.value}>
                      {item.text} ({item.sortName})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="bank_number" label="Số tài khoản">
                <Input placeholder="Số tài khoản" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item name="bank_owner" label="Tên chủ tài khoản">
                <Input placeholder="Tên chủ tài khoản" />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item label="Thao tác">
                <Button className="btn-primary" onClick={() => form.submit()}>
                  Cập nhật
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>
    </>
  );
}
