import React from "react";
import { Button, Form, Input, Spin, updateQueryParams } from "remix-dls";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import AuthActions from "pages/Auth/_redux/actions";
import AuthSelectors from "pages/Auth/_redux/selectors";

export default function ForgotPasswordComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector(AuthSelectors.selectLoading);

  const handleForgot = (values) => {
    dispatch(
      AuthActions.onForgot({
        params: values,
        callback: () => {
          const urlString = updateQueryParams({ email: values?.email });
          history.push(`/send-mail${urlString}`);
        },
      })
    );
  };

  return (
    <Form layout="vertical" className="auth-form" onFinish={handleForgot}>
      <Spin tip="Loading..." spinning={loading}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Nhập Tên đăng nhập",
            },
            {
              type: "email",
              message: "Vui lòng nhập email",
            },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-auth">
            <span>Gửi</span>
          </Button>
        </Form.Item>
      </Spin>
    </Form>
  );
}
