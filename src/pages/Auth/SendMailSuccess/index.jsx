import { Button, get, getQueryParams } from "remix-dls";
import React, { useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";

const SendMailSuccess = () => {
  const history = useHistory();
  const location = useLocation();
  const { search } = location;

  const filters = useMemo(() => getQueryParams(search) || {}, [search]);

  return (
    <div className="remix-auth-page">
      <div className="auth-auth-container">
        <h2>Khôi phục mật khẩu</h2>
        <h5>Chúng tôi đã gửi đến mail của bạn.</h5>
        <p>
          Chúng tối đã gửi mã xác thực tới email <b>{get(filters, "email")}</b>
        </p>
        <div className="resend-container">
          <h4>
            Bạn không nhận được email? Vui lòng kiểm tra hòm thư ra hoặc :
          </h4>
          <Button
            className="btn-resend"
            onClick={() => {
              history.push("/login");
            }}
          >
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendMailSuccess;
