import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "_common/hooks";

const CheckAuth = observer(({ children }) => {
  const { authStore } = useStores();
  const location = useLocation();

  if (authStore.authenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
});

export default CheckAuth;
