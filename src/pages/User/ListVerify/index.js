import React, { useEffect, useState } from "react";
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
  Image,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import Filter from "./Filter";

const ListVerify = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page");

  const { data, isLoading, refetch } = useQuery(
    ["user", "verify", currentPage],
    () =>
      UserApi.getList({
        params: {
          page: currentPage || 1,
          limit: 10,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

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
            <h2 className="remix-page-title">Xác minh</h2>
          </div>

          <Card>
            <Filter />
            <GridView
              column={[
                {
                  key: "code",
                  title: "Email",
                  dataIndex: "code",
                  width: "30%",
                  render: (value, rows) => {
                    return (
                      <div>
                        <p>Email: {rows?.email}</p>
                        <p>Số căn cước (CMT): {rows?.identify_number}</p>
                      </div>
                    );
                  },
                },
                {
                  key: "username",
                  title: "Tên",
                  dataIndex: "username",
                  width: "15%",
                  render: (value, rows) => {
                    return (
                      <div>
                        <p>Biệt danh: {rows?.username}</p>
                      </div>
                    );
                  },
                },
                {
                  key: "full_name",
                  title: "CMND Mặt trước",
                  dataIndex: "full_name",
                  width: "15%",
                  render: (value, rows) => {
                    return <Image />;
                  },
                },
                {
                  key: "phone",
                  title: "CMND Mặt sau",
                  dataIndex: "phone",
                  width: "15%",
                  render: (value, rows) => {
                    return <Image />;
                  },
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
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button className="btn-sm">Đồng ý</Button>
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
                  navigate(`/users/verify?page=${page}`);
                },
              }}
              showTitleMobile={false}
              loading={isLoading}
            />
          </Card>
        </div>
      </div>
    </div>
  );
});

export default ListVerify;
