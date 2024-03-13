import React from "react";
import classNames from "classnames";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faFileAlt,
  faSearch,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

export default function MobileFooter({ toggleMenu, toggleCollapsed, menus }) {
  const location = useLocation();
  const list = [
    {
      key: "home",
      to: "/",
      title: "Trang chủ",
      icon: faHome,
    },
    {
      key: "orders",
      to: "/orders",
      title: "Đơn hàng",
      icon: faFileAlt,
    },
    {
      key: "search",
      to: "/search",
      title: "Tra cứu",
      icon: faSearch,
    },
    {
      key: "profile",
      to: "/profile",
      title: "Người dùng",
      icon: faUser,
    },
  ];

  return (
    <div className="mobile-footer-inner">
      {list.map((item) => {
        const pathname = location?.pathname;
        return (
          <div
            key={item?.key}
            className={classNames("menu-item", item?.class, {
              active: pathname === item.to,
            })}
          >
            <Link to={item.to}>
              <FontAwesomeIcon icon={item?.icon} />
              <span>{item.title}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
