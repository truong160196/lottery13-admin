import React, { useMemo, useState } from "react";
import {
  Button,
  formatDate,
  get,
  GridView,
  Empty,
  formatNumber,
  updateQueryParams,
} from "remix-dls";
import { usePermission } from "_common/hooks/usePermission";
import {
  gameBetText,
  gameStatusColor,
  gameStatusText,
  gameTypeBetText,
} from "_common/constants/statusType";

const ListData = ({ data, isLoading, setParams }) => {
  const { isAdmin } = usePermission();

  if (!data?.data?.length)
    return (
      <div className="remix-page">
        <Empty description="Không có dữ liệu đặt cược" />
      </div>
    );

  return (
    <>
      <GridView
        column={[
          {
            key: "user_id",
            title: "Tài khoản",
            dataIndex: "user_id",
            width: "20%",
            render: (value, rows) => {
              return (
                <>
                  <p>ID: {rows?.user?.username}</p>
                  <p>Tên: {rows?.user?.full_name}</p>
                </>
              );
            },
          },
          {
            key: "game_id",
            title: "Loại",
            dataIndex: "game_id",
            width: "20%",
            render: (value, rows) => {
              return (
                <>
                  <p>ID: {rows?.game_id}</p>
                  <p>Phiên game: {rows?.game?.game_no}</p>
                </>
              );
            },
          },
          {
            key: "game_bet",
            title: "Đặt cược",
            dataIndex: "game_bet",
            width: "20%",
            render: (value, rows) => {
              return (
                <>
                  <p>
                    {gameBetText[rows?.game_bet_text] || rows?.game_bet_text}
                  </p>
                </>
              );
            },
          },
          {
            key: "amount",
            title: "Tiền cược",
            dataIndex: "amount",
            width: "15%",
            render: (value) => formatNumber(value),
          },
          {
            key: "created_at",
            title: "Thời gian",
            dataIndex: "created_at",
            width: "15%",
            render: (value) =>
              value && formatDate(value, "DD/MM/YYYY HH:mm:ss"),
          },
        ]}
        data={data?.data || []}
        pagination={{
          current: parseInt(get(data, "current_page"), 10) || 1,
          pageSize: parseInt(get(data, "per_page"), 10) || 10,
          total: get(data, "total"),
          onChange: (page, pageSize) => {
            setParams({
              page,
              limit: pageSize,
            });
          },
        }}
        loading={isLoading}
      />
    </>
  );
};

export default ListData;
