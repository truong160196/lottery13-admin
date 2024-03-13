import React from "react";
import { Button, Spin } from "remix-dls";
import { useNavigate } from "react-router-dom";
import { useStores } from "_common/hooks";
import { observer } from "mobx-react-lite";

// component
import LoginComponent from "./LoginForm";

const LoginPage = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  const loading = false;

  const handleRedirectForgotPass = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="remix-auth-page">
      <div className="auth-auth-container login-container">
        <Spin tip="Loading..." spinning={loading}>
          {authStore?.logo && (
            <img className="logo-img" src={authStore?.logo} alt="Logo" />
          )}
          <h2>Đăng nhập</h2>
          <LoginComponent />
          <div className="forgot-base">
            <Button
              className="btn-forgot"
              onClick={() => handleRedirectForgotPass()}
            >
              Quên mật khẩu
            </Button>
          </div>
        </Spin>
      </div>
    </div>
  );
});

export default LoginPage;
