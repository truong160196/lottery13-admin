import React, { useMemo, useState } from "react";
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
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import Filter from "./Filter";

const ExchangePage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const [listChecked, setCheckData] = useState([]);

  const { data, isLoading } = useQuery(
    ["user", "list", filters],
    () =>
      UserApi.getList({
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

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (id) => {
      return UserApi.delete({ id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["user", "list"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const menus = (
    <Menu className="action-menu">
      <Menu.Item key="1">Xoá</Menu.Item>
      <Menu.Item key="3" onClick={() => setCheckData([])}>
        Bỏ chọn tất cả
      </Menu.Item>
    </Menu>
  );

  const handleCheckList = (ids) => {
    setCheckData(ids);
  };

  if (!isAdmin)
    return (
      <div className="remix-page">
        <Empty description="Không có quyền truy cấp" />
      </div>
    );

  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <div className="remix-sub-header">
            <h2 className="remix-page-title">Danh sách đổi tiền</h2>
          </div>
          <Card>
            <Filter />
            <GridView
              column={[
                {
                  key: "code",
                  title: "Tài khoản",
                  dataIndex: "code",
                  width: "20%",
                  render: (value, rows) => {
                    return (
                      <>
                        <p>{rows?.email}</p>
                        <p>Biệt danh: sky</p>
                      </>
                    );
                  },
                },
                {
                  key: "username",
                  title: "Mô tả",
                  dataIndex: "username",
                  width: "10%",
                  render: (value) => {
                    return (
                      <>
                        <p>Từ: SYS</p>
                        <p>Đến: USDT</p>
                      </>
                    );
                  },
                },
                {
                  key: "full_name",
                  title: "Đã gửi",
                  dataIndex: "full_name",
                  width: "15%",
                  render: (value) => formatNumber(100000),
                },
                {
                  key: "full_name",
                  title: "Đã nhận",
                  dataIndex: "full_name",
                  width: "15%",
                  render: (value) => formatNumber(100000),
                },
                {
                  key: "status",
                  title: "Trạng thái",
                  dataIndex: "status",
                  width: "10%",
                  render: (value) => {
                    return (
                      <Tag color={statusColor[value]}>{statusText[value]}</Tag>
                    );
                  },
                },
                {
                  key: "created_at",
                  title: "Thời gian",
                  dataIndex: "created_at",
                  width: "13%",
                  render: (value) => formatDate(value, "DD/MM/YYYY HH:mm:ss"),
                },
                {
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  title: "Tác vụ",
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button className="btn-sm">Chi tiết</Button>
                      </div>
                    );
                  },
                },
              ]}
              data={data?.data || []}
              pagination={{
                current: parseInt(get(data, "current_page"), 10) || 1,
                pageSize: parseInt(get(data, "per_page"), 10) || 10,
                total: get(data, "total"),
                onChange: (page) => {
                  const urlString = updateQueryParams({ ...filters, page });
                  navigate({
                    pathname: window.location.pathname,
                    search: urlString,
                  });
                },
              }}
              showCheckbox
              onCheckBox={handleCheckList}
              defaultCheckbox={listChecked}
              menuCheckbox={menus}
              loading={isLoading || deleteLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
});

export default ExchangePage;
