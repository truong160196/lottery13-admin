import React, { useState } from "react";
import { BackTop, Content, Layout } from "remix-dls";
import { Outlet } from "react-router-dom";
import "_common/styles/layout/mobile.scss";

import HeaderLayout from "../Header/DesktopHeader";
import SlideBar from "../SlideBar";
import MobileFooter from "../Footer/MobileFooter";

export default function MobileLayout() {
  const [toggleMenu, toggleCollapsed] = useState(false);

  return (
    <Layout className="remix-theme-cms">
      {/* <HeaderLayout toggleMenu={toggleMenu} toggleCollapsed={toggleCollapsed} /> */}
      <SlideBar toggleMenu={toggleMenu} toggleCollapsed={toggleCollapsed} />
      <Layout className="site-layout">
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <MobileFooter />
    </Layout>
  );
}
