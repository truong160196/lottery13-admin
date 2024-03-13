import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spin } from "remix-dls";
import logo from "_common/styles/images/logo.png";

// redux

import RegisterComponent from "./RegisterForm";

const RegisterPage = () => {
  const navigate = useNavigate();
  const loading = false;

  const handleRedirectLogin = () => {
    navigate("/login");
  };

  return (
    <div className="remix-auth-page">
      <div className="auth-auth-container login-container">
        <Spin tip="Loading..." spinning={loading}>
          <img className="logo-img" src={logo} alt="Logo" />
          <h2>Đăng Ký</h2>
          <RegisterComponent />
          <div className="btn-group">
            <Button className="link-href" onClick={handleRedirectLogin}>
              <span>Đã có tài khoản ? Đăng nhập ngay</span>
            </Button>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default RegisterPage;
