import React, { useEffect, useMemo, useState } from "react";
import { AvatarHeader, Button, Header, Menu, Input } from "remix-dls";
import {
  createSearchParams,
  Link,
  NavLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
// redux
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useStores } from "_common/hooks";
import { message } from "antd";
import { AuthApi } from "states/api";
import { useMutation } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import classNames from "classnames";

const HeaderLayout = observer(({ toggleMenu, toggleCollapsed }) => {
  const navigate = useNavigate();
  const {
    authStore: { user, isAdmin, position, clear },
  } = useStores();

  const [params] = useSearchParams();
  const keyword = params.get("keyword");
  const currentTab = params.get("tab");

  const { mutate: onLogout } = useMutation(AuthApi.logout, {
    onSuccess: (res) => {
      message.success(res?.data?.msg);
      clear();
    },
    onError: (error) => {
      const errorMessage = error?.message ?? "Vui lòng thử lại!";
      message.error(errorMessage);
      clear();
    },
  });

  const handleKeyUp = (event) => {
    if (event?.keyCode === 13) {
      const urlString = createSearchParams({
        keyword: event?.target?.value,
        tab: currentTab,
      });
      navigate({
        pathname: window.location?.pathname,
        search: `?${urlString}`,
      });
    }
  };

  const menuUser = (
    <Menu>
      <Menu.Item key="1">
        <Link to="/profile/update-profile">Thông tin tài khoản</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/profile/change-password">Thay đổi mật khẩu</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" onClick={onLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      className={classNames("remix-dls-header", {
        "has-toggle": toggleMenu,
      })}
    >
      <div className="remix-header-left ">
        <div className="remix-toggle-menu">
          <Button
            className="btn-menu-header"
            onClick={() => toggleCollapsed(!toggleMenu)}
          >
            <FontAwesomeIcon icon={faBars} />
          </Button>
        </div>
        <div
          className="remix-logo-title hide-mobile"
          onClick={() => {
            if (isAdmin || position === "manager") {
              navigate("/");
            } else {
              navigate("/orders");
            }
          }}
        >
          <h2>Quản trị website</h2>
        </div>
        {/* <div className="remix-search">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm nhanh yêu cầu và đơn hàng"
            defaultValue={keyword}
            onKeyUp={handleKeyUp}
          />
        </div> */}
      </div>
      <div className="remix-header-right">
        {/* <Menu mode="horizontal">
          <Menu.Item key="0">
            <NavLink to="/orders">Xử lý đơn hàng</NavLink>
          </Menu.Item>
          <Menu.Item key="1">
            <NavLink to="/orders/sign">Đã ký đóng</NavLink>
          </Menu.Item>

          {(isAdmin || position === "accountant") && (
            <Menu.Item key="5">
              <NavLink to="/debt/list">Công nợ</NavLink>
            </Menu.Item>
          )}

          {isAdmin && (
            <Menu.Item key="2">
              <NavLink key="category_list" to="/product/list">
                Danh mục
              </NavLink>
            </Menu.Item>
          )}
          {(isAdmin || position === "manager") && (
            <Menu.Item key="3">
              <NavLink to="/report"> Báo cáo</NavLink>
            </Menu.Item>
          )}
        </Menu> */}
        <AvatarHeader
          avatarSrc={user?.avatar_url}
          title={user?.full_name}
          menu={menuUser}
        />
      </div>
    </Header>
  );
});

export default HeaderLayout;
