import React from 'react';
import { Button, Form, Input } from 'remix-dls';

export default function ChangePasswordComponent() {
  return (
    <Form layout="vertical" className="auth-form">
      <Form.Item
        name="otp"
        className="input-code"
        rules={[
          {
            required: true,
            message: 'Nhập mã xác thực',
          },
        ]}
      >
        <Input maxLength={6} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="btn-auth">
          <span>Tiếp Tục</span>
        </Button>
      </Form.Item>
    </Form>
  );
}
