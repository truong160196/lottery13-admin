import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
  Popconfirm,
  message,
  Empty,
  Tag,
  formatNumber,
  Menu,
  Input,
  getQueryParams,
  updateQueryParams,
  Form,
  TextArea,
  InputNumber,
  Row,
  Col,
  Spin,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useLocation, useNavigate } from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import { PaymentApi } from "states/api/payment";
import { useNotify } from "_common/component/NotifyProvider";

const MoneyPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pushNotify } = useNotify();
  const location = useLocation();
  const [form] = Form.useForm();

  const { mutate: onPayment, isLoading } = useMutation(
    (variables) => {
      return PaymentApi.updateBalance({
        params: { ...variables, type: "system" },
      });
    },
    {
      onSuccess: (res) => {
        form.resetFields();
        pushNotify({
          type: "update_user",
        });
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleSubmit = (values) => {
    onPayment(values);
  };

  if (!isAdmin)
    return (
      <div className="remix-page">
        <Empty description="Không có quyền truy cấp" />
      </div>
    );

  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <div className="remix-sub-header">
            <h2 className="remix-page-title">Nạp tiền tài khoản</h2>
          </div>
          <Spin spinning={isLoading} tip="Đang tải ....">
            <Form
              layout="vertical"
              className="form-cms"
              style={{ marginTop: 0 }}
              initialValues={{}}
              form={form}
              onFinish={handleSubmit}
            >
              <Card>
                <Row>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tài khoản"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "ID hoặc tên đăng nhập",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập biệt danh" />
                    </Form.Item>
                    <Form.Item label="Nạp tiền" name="amount1">
                      <InputNumber min={0} placeholder="Nhập số tiền" />
                    </Form.Item>
                    <Form.Item label="Trừ tiền rút" name="amount3">
                      <InputNumber min={0} placeholder="Nhập số tiền" />
                    </Form.Item>
                    <Form.Item
                      label="Trừ tiền tài khoản - không lưu lịch sử"
                      name="amount4"
                    >
                      <InputNumber min={0} placeholder="Nhập số tiền" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className="btn-primary"
                        onClick={() => form.submit()}
                      >
                        Cập nhật
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                <p className="text-green">
                  + Vui lòng nhập <b>nạp tiền </b>để cộng tiền vào tài khoản
                </p>
                <p className="text-red">
                  + Vui lòng nhập <b>trừ tiền rút </b>để trừ tiền tài khoản
                </p>
                <p className="text-black">
                  + Vui lòng nhập <b>Trừ tiền tài khoản </b>để trừ tiền vào tài
                  khoản nhưng không thống kê
                </p>
                <p className="text-red">
                  <b>
                    Vui lòng chỉ nhập 1 lựa chọn để tránh lỗi khi cộng hoặc trừ
                    tiền
                  </b>
                </p>
              </Card>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
});

export default MoneyPage;
