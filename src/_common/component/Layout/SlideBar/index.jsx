import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { Sider, Menu, SubMenu, get } from "remix-dls";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
import { usePermission } from "_common/hooks/usePermission";
import { useStores } from "_common/hooks";
import PerfectScrollbar from "react-perfect-scrollbar";
import { observer } from "mobx-react-lite";

import { menuData } from "./data";

const SlideBar = observer(({ toggleMenu, toggleCollapsed }) => {
  const { isAdmin } = usePermission();
  const {
    authStore: { role, logo },
  } = useStores();
  const location = useLocation();
  const [params] = useSearchParams();

  const pathName = get(location, "pathname");

  const renderMenu = useMemo(() => {
    return (
      <>
        {menuData.map((item, index) => {
          if (item?.subs?.length) {
            if (!item.role && !isAdmin) return <></>;
            return (
              <SubMenu
                key={`${item.key}-${index.toString()}`}
                icon={item?.icon}
                title={item?.title}
              >
                {item?.subs?.map((obj, idx) => {
                  if (obj.role === true || obj.role === role || isAdmin) {
                    return (
                      <Menu.Item
                        key={`${item.key}-${obj.key}-${idx.toString()}}`}
                        icon={obj?.icon}
                        className={classNames({
                          "ant-menu-item-selected": pathName === obj?.path,
                        })}
                      >
                        <NavLink to={obj.path}>{obj.title}</NavLink>
                      </Menu.Item>
                    );
                  }
                  return <></>;
                })}
              </SubMenu>
            );
          }

          if (item?.groups?.length) {
            if (!item.role && !isAdmin) return <></>;
            return (
              <Menu.ItemGroup
                key={`${item.key}-${index.toString()}}`}
                title={item?.title}
              >
                {item?.groups?.map((obj, idx) => {
                  if (obj.role === true || obj.role === role || isAdmin) {
                    return (
                      <Menu.Item
                        key={`${item.key}-${obj.key}-${idx.toString()}}`}
                        icon={obj?.icon}
                        className={classNames({
                          "ant-menu-item-selected": pathName === obj?.path,
                        })}
                      >
                        <NavLink to={obj.path}>{obj.title}</NavLink>
                      </Menu.Item>
                    );
                  }
                  return <></>;
                })}
              </Menu.ItemGroup>
            );
          }

          if (item.role === true || item.role === role || isAdmin) {
            return (
              <Menu.Item
                key={`${item.key}-${index.toString()}}`}
                icon={item?.icon}
              >
                <NavLink to={item.path}>{item.title}</NavLink>
              </Menu.Item>
            );
          }

          return <></>;
        })}
      </>
    );
  }, [menuData, pathName]);

  return (
    <>
      <Sider
        collapsedWidth={0}
        collapsed={toggleMenu}
        onCollapse={toggleCollapsed}
      >
        <div className="sider-top">
          <Link to="/">
            <img src={logo} className="logo" alt="logo" />
          </Link>
        </div>
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <Menu mode="inline">{renderMenu}</Menu>
        </PerfectScrollbar>
      </Sider>
    </>
  );
});

export default SlideBar;
