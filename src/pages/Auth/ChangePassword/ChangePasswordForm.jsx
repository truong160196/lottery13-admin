import React from "react";
import { Button, Form, Input, Spin } from "remix-dls";
import { useSelector, useDispatch } from "react-redux";

import UserActions from "pages/User/_redux/actions/user";
import UserSelectors from "pages/User/_redux/selectors/user";

export default function ChangePasswordForm() {
  const dispatch = useDispatch();
  const loading = useSelector(UserSelectors.selectLoading);

  const handleChangePassword = (values) => {
    dispatch(UserActions.onChangePassword({ params: { ...values } }));
  };

  return (
    <Form
      layout="vertical"
      className="auth-form"
      onFinish={handleChangePassword}
    >
      <Spin tip="Loading..." spinning={loading}>
        <Form.Item
          name="password"
          label="Mật khâu Cũ"
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu cũ",
            },
          ]}
        >
          <Input.Password placeholder="Mật Khẩu Đăng Nhập Cũ" />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Mật khâu Mới"
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu mới",
            },
            {
              min: 8,
              message: "Nhập tối thiểu 8 ký tự",
            },
          ]}
        >
          <Input.Password placeholder="Mật Khẩu Đăng Nhập Mới" />
        </Form.Item>
        <Form.Item
          label="Nhập Lại Mật khâu"
          name="confirmed"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Mật khẩu không thể bỏ trông",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không trùng khớp"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập Lại Mật khâu Mật khẩu" allowClear />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-auth">
            <span>Thay Đổi</span>
          </Button>
        </Form.Item>
      </Spin>
    </Form>
  );
}
