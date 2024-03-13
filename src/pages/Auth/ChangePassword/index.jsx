import React from 'react';
import ChangePasswordForm from './ChangePasswordForm';

const ChangePassword = () => {
  return (
    <div className="remix-auth-page">
      <div className="auth-auth-container">
        <h2>Thay Đổi Mật Khẩu</h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePassword;
