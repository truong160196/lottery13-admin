import React from "react";
import { Card, Row, Col } from "remix-dls";
import { observer } from "mobx-react";
import UpdateProfile from "pages/Profile/container/UpdateProfile";

const UpdateProfilePage = observer(() => {
  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <UpdateProfile />
        </div>
      </div>
    </div>
  );
});

export default UpdateProfilePage;
