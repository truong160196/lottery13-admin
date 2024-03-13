import React from "react";
import { Card, Row, Col, message } from "remix-dls";
import { observer } from "mobx-react";
import { useStores } from "_common/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUser,
  faLock,
  faImage,
  faMessage,
  faSignOut,
  faChevronRight,
  faElevator,
  faChartLine,
  faCog,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "states/api";

const ProfileMenuPage = observer(() => {
  const {
    authStore: { user, clear },
  } = useStores();

  const { mutate: onLogout } = useMutation(AuthApi.logout, {
    onSuccess: (res) => {
      clear();
      message.success(res?.data?.msg);
    },
    onError: (error) => {
      clear();
      const errorMessage = error?.message ?? "Vui lòng thử lại!";
      message.error(errorMessage);
    },
  });

  return (
    <div className="box profile-page p-0">
      <div className="snapshot">
        <img src={user?.avatar_url} className="avatar" alt="avatar" />
        <div className="left-user">
          <h2>{user?.full_name}</h2>
          <h5>Chức vụ: {user?.current_position}</h5>
          <p>Phòng ban: {user?.current_department}</p>
        </div>
      </div>
      <div className="user-info">
        <p>
          <FontAwesomeIcon icon={faEnvelope} />
          {user?.email}
        </p>
        <p>
          <FontAwesomeIcon icon={faPhone} />
          {user?.phone}
        </p>
      </div>
      <ul className="list-menu">
        <Link to="/profile/update-profile">
          <FontAwesomeIcon icon={faUser} />
          Cập nhật thông tin
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </Link>
        <Link to="/profile/change-password">
          <FontAwesomeIcon icon={faLock} />
          Đổi mật khẩu
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </Link>
        <Link to="/mail">
          <FontAwesomeIcon icon={faElevator} />
          Hộp thư
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </Link>
        <Link to="/profile/report">
          <FontAwesomeIcon icon={faFlag} />
          Theo dõi công nợ
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </Link>
        <Link to="/profile">
          <FontAwesomeIcon icon={faChartLine} />
          Báo cáo doanh thu
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </Link>
        <a href="https://zalo.me/84372136156">
          <FontAwesomeIcon icon={faMessage} />
          Chat với đội ngũ văn phòng hỗ trợ
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </a>
        <Link to="/setting">
          <FontAwesomeIcon icon={faCog} />
          Cài đặt
          <FontAwesomeIcon className="icon-suffix" icon={faChevronRight} />
        </Link>
        <Link
          to="/auth/login"
          className="btn-logout"
          onClick={() => onLogout()}
        >
          <FontAwesomeIcon icon={faSignOut} />
          Đăng xuất
        </Link>
      </ul>
    </div>
  );
});

export default ProfileMenuPage;
