import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
  Popconfirm,
  message,
  Empty,
  Tag,
  formatNumber,
  Menu,
  Input,
  getQueryParams,
  updateQueryParams,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { usePermission } from "_common/hooks/usePermission";
import { GamePlayerApi } from "states/api/gamePlayer";
import {
  gameBetText,
  gameStatusColor,
  gameStatusText,
} from "_common/constants/statusType";
import Filter from "./Filter";
import ListData from "./ListData";

const HistoryBet = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const { data: dataState, isLoading, refetch } = useQuery(
    ["game-player", "list", filters],
    () =>
      GamePlayerApi.getList({
        params: {
          page: 1,
          limit: 10,
          ...filters,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  const data = get(dataState, "data");
  const summary = get(dataState, "summary", {});

  useEffect(() => {
    refetch();
  }, []);

  // if (!isAdmin)
  //   return (
  //     <div className="remix-page">
  //       <Empty description="Không có quyền truy cấp" />
  //     </div>
  //   );

  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <div className="remix-sub-header">
            <h2 className="remix-page-title">Danh sách đặt cược</h2>
          </div>
          <Card>
            <Filter />
            <ListData data={data} isLoading={isLoading} />
          </Card>
        </div>
      </div>
    </div>
  );
});

export default HistoryBet;
