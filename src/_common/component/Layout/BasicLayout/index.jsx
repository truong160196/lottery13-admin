import React, { useState } from "react";
import { useMediaQuery } from "_common/component/MediaQueryProvider";
import { useStores } from "_common/hooks";
import PageLoading from "_common/component/PageLoading";
import { observer } from "mobx-react-lite";
import MobileLayout from "./MobileLayout";
import DesktopLayout from "./DesktopLayout";

const BasicLayout = observer(() => {
  const { authStore } = useStores();
  const { isMobile } = useMediaQuery();

  if (!authStore.token) return <PageLoading />;
  if (!authStore.role) return <PageLoading />;
  // if (isMobile) return <MobileLayout />;

  return <DesktopLayout />;
});

export default BasicLayout;
