import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthApi } from "states/api";

import { Routers } from "routers";
import { useStores } from "_common/hooks";

const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

function Root() {
  const { authStore } = useStores();

  useQuery(["get_device"], AuthApi.getDeviceCode, {
    cacheTime: 300000,
    staleTime: 300000,
    onSuccess: (data) => {
      authStore.setInitData(data);
    },
  });

  useQuery(["get_profile"], AuthApi.getProfile, {
    cacheTime: 300000,
    staleTime: 300000,
    enabled: !!authStore.token,
    onSuccess: (res) => {
      authStore.updateUser(res?.data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <BrowserRouter basename={basename}>
      <Routers />
    </BrowserRouter>
  );
}

export default Root;
