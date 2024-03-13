import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";
import PageLoading from "_common/component/PageLoading";
import { useStores } from "_common/hooks";

const UnAuthLayout = observer(() => {
  const { authStore } = useStores();
  if (!authStore.logo) return <PageLoading />;
  return <Outlet />;
});

export default UnAuthLayout;
