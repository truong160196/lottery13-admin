import React, { useState } from "react";
import { BackTop, Content, Layout } from "remix-dls";
import { UpCircleOutlined } from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import DesktopHeader from "../Header/DesktopHeader";
import SlideBar from "../SlideBar";

export default function DesktopLayout() {
  const [toggleMenu, toggleCollapsed] = useState(false);

  return (
    <Layout className="remix-theme-cms">
      <DesktopHeader
        toggleMenu={toggleMenu}
        toggleCollapsed={toggleCollapsed}
      />
      <SlideBar toggleMenu={toggleMenu} toggleCollapsed={toggleCollapsed} />
      <Layout className="site-layout">
        <Content>
          <Outlet />
          <BackTop>
            <UpCircleOutlined />
          </BackTop>
        </Content>
      </Layout>
    </Layout>
  );
}
