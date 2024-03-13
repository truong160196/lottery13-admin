import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button, Form, Input } from "remix-dls";
import { UserOutlined } from "@ant-design/icons";
import { AuthApi } from "states/api";
import { message, Spin } from "antd";
import { useStores } from "_common/hooks";

export default function LoginComponent() {
  const { authStore } = useStores();
  const { mutate, isLoading } = useMutation(
    (variables) => AuthApi.login(variables),
    {
      onSuccess: (res) => {
        authStore.updateToken(res?.data?.token);
        authStore.updateUser(res?.data?.user);
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleLogin = (values) => {
    if (isLoading) return;
    mutate(values);
  };

  return (
    <Spin tip="Loading..." spinning={isLoading}>
      <Form layout="vertical" className="auth-form-user" onFinish={handleLogin}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Nhập tên đăng nhập hoặc Email",
            },
          ]}
        >
          <Input placeholder="Nhập Tên đăng nhập hoặc Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu",
            },
          ]}
        >
          <Input.Password placeholder="Nhập Mật Khẩu" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-auth">
            <UserOutlined />
            <span>Đăng Nhập</span>
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
