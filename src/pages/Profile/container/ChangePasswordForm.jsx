import React from "react";
import { Button, Card, Form, Input, message, Spin } from "remix-dls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileApi } from "states/api";
import { useStores } from "_common/hooks";

export default function ChangePasswordForm() {
  const {
    authStore: { clear },
  } = useStores();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation(
    (variables) => {
      return ProfileApi.changePassword({ params: variables });
    },
    {
      onSuccess: (res) => {
        clear();
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleChangePassword = (values) => {
    mutate(values);
  };

  return (
    <Form
      layout="vertical"
      className="auth-form"
      form={form}
      onFinish={handleChangePassword}
    >
      <Spin tip="Loading..." spinning={isLoading}>
        <Card>
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
                min: 6,
                message: "Nhập tối thiểu 6 ký tự",
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
            <Input.Password
              placeholder="Nhập Lại Mật khâu Mật khẩu"
              allowClear
            />
          </Form.Item>
        </Card>
        <div className="btn-footer-form ">
          <Button
            className="btn-primary"
            type="submit"
            onClick={() => form.submit()}
          >
            Cập nhật thông tin
          </Button>
        </div>
      </Spin>
    </Form>
  );
}
