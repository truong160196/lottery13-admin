import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "remix-dls";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import ForgotPasswordComponent from "./ForgotPasswordForm";

const ForgotPassword = () => {
  const history = useHistory();

  const handleRedirectLogin = () => {
    history.push("/login");
  };

  const handleRedirectRegister = () => {
    history.push("/register");
  };

  return (
    <div className="remix-auth-page">
      <div className="auth-auth-container">
        <h2>Quên mật khẩu</h2>
        <ForgotPasswordComponent />
        <div className="btn-group">
          <Button className="link-href" onClick={handleRedirectLogin}>
            <UserOutlined />
            <span>Đăng nhập</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
