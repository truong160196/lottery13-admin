import React from "react";
import { observer } from "mobx-react";
import ChangePasswordForm from "pages/Profile/container/ChangePasswordForm";
import { Col, Row } from "remix-dls";

const ChangePasswordPage = observer(() => {
  return (
    <>
      <div className="remix-page">
        <div className="main-content-inner">
          <div className="page-container">
            <div className="remix-sub-header">
              <h2 className="remix-page-title">Thay đổi mật khẩu</h2>
            </div>
            <Row>
              <Col xs={{ span: 24 }} md={{ span: 12, offset: 6 }}>
                <ChangePasswordForm />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
});

export default ChangePasswordPage;
