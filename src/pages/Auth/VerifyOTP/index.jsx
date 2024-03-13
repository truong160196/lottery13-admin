import { Button } from 'remix-dls';
import React from 'react';
import ChangePasswordComponent from './VerifyOTP';

const VerifyOTPDemo = () => {
  return (
    <div className="remix-auth-page">
      <div className="auth-auth-container">
        <h2>Nhập Mã Xác Thực</h2>
        <h5>Chúng tôi đã gửi đến mail của bạn.</h5>
        <p>Chúng tối đã gửi mã xác thực tới email ****@gmail.comment</p>
        <ChangePasswordComponent />
        <div className="resend-container">
          <h4>
            Bạn không nhận được email? Vui lòng kiểm tra hòm thư ra hoặc :
          </h4>
          <Button className="btn-resend">Gửi Lại Mã</Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPDemo;
