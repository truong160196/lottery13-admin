import React from "react";
import { Card, Row, Col } from "remix-dls";
import { observer } from "mobx-react";
import UpdateProfile from "pages/Profile/container/UpdateProfile";

const ProfilePage = observer(() => {
  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <Row>
            <Col xs={24} md={6}>
              <div className="nav-profile">
                <Card>
                  <ul>
                    <li>Update profile</li>
                  </ul>
                </Card>
              </div>
            </Col>
            <Col xs={24} md={18}>
              <UpdateProfile />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});

export default ProfilePage;
