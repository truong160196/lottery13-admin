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
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GamePlayerApi } from "states/api/gamePlayer";
import ListData from "./ListData";

const ListPlayer = ({ game_id }) => {
  const [params, setParams] = useState({});

  const { data: dataState, isLoading } = useQuery(
    ["game-player", "list", game_id, params],
    () =>
      GamePlayerApi.getList({
        params: {
          page: 1,
          limit: 10,
          game_id,
          ...params,
        },
      }),
    {
      staleTime: 300000,
      enabled: !!game_id,
    }
  );

  const data = get(dataState, "data");
  const summary = get(dataState, "summary", {});

  return (
    <>
      <p className="mb-0">
        Tổng tiền cược:{" "}
        <span className="amount-text">
          <b>{formatNumber(get(summary, "totalAmount", 0))}</b>
        </span>
      </p>
      <ListData
        data={data}
        isLoading={isLoading}
        setParams={setParams}
        showCheckbox={false}
      />
      ;
    </>
  );
};

export default ListPlayer;
