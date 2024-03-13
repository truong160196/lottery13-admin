import React from "react";
import { observer } from "mobx-react";
import ChangePasswordForm from "pages/Profile/container/ChangePasswordForm";

const SettingPage = observer(() => {
  return (
    <>
      <div className="header-title-inner title">
        <div className="title">
          <h4>Cài đặt</h4>
        </div>
      </div>
      <div className="main-layout-inner">
        <ChangePasswordForm />
      </div>
    </>
  );
});

export default SettingPage;
