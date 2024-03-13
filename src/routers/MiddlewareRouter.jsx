import React from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "_common/hooks";
import { Navigate, useLocation } from "react-router-dom";

export const MiddlewareRouter = observer(({ children }) => {
  const { authStore } = useStores();
  const location = useLocation();

  if (authStore.device && !authStore.authenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});
