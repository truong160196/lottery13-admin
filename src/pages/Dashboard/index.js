import { useQuery } from "@tanstack/react-query";
import { Button, Select } from "antd";
import React, { useEffect } from "react";
import { useStores } from "_common/hooks";
import Report from "./Report";

const DashboardPage = () => {
  const {
    authStore: { isAdmin, position },
  } = useStores();

  return <Report />;
};

export default DashboardPage;
