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
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import Filter from "./Filter";
import CreateUpdateModal from "./CreateUpdateModal";

const ChampionPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const [listChecked, setCheckData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [detailData, setDetailData] = useState();

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
      enabled: false,
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

  const onOpenUpdateModal = (item) => {
    setOpenModalCreate(true);
    setDetailData(item);
  };

  const onCloseModal = (item) => {
    setOpenModalCreate(false);
    setDetailData(null);
  };

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
            <h2 className="remix-page-title">Quản lý giải đấu</h2>
            <div className="remix-page-control">
              <Button
                className="btn-control btn-success"
                onClick={() => setOpenModalCreate(true)}
              >
                Tạo giải đấu
              </Button>
            </div>
          </div>
          <Card>
            <Filter />
            <GridView
              column={[
                {
                  key: "code",
                  title: "Tên giải đấu",
                  dataIndex: "code",
                  width: "25%",
                  render: (value, rows) => {
                    return (
                      <>
                        <p>{rows?.username}</p>
                      </>
                    );
                  },
                },
                {
                  key: "username",
                  title: "Ngày bắt đầu",
                  dataIndex: "username",
                  width: "12%",
                  render: (value, rows) =>
                    formatDate(rows?.created_at, "DD/MM/YYYY"),
                },
                {
                  key: "username",
                  title: "Ngày kết thúc",
                  dataIndex: "username",
                  width: "12%",
                  render: (value, rows) =>
                    formatDate(rows?.created_at, "DD/MM/YYYY"),
                },
                {
                  key: "full_name",
                  title: "Tổng phần thưởng",
                  dataIndex: "full_name",
                  width: "15%",
                  render: (value) => formatNumber(100000),
                },
                {
                  key: "phone",
                  title: "Loại giải đấu",
                  dataIndex: "phone",
                  width: "15%",
                },
                {
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  title: "Tác vụ",
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button
                          className="btn-info"
                          onClick={() => onOpenUpdateModal(item)}
                        >
                          Sửa
                        </Button>
                        <Button
                          className="btn-danger"
                          onClick={() => onOpenUpdateModal(item)}
                        >
                          Xoá
                        </Button>
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
      {openModalCreate && (
        <CreateUpdateModal
          visible={openModalCreate}
          onClose={onCloseModal}
          onRefreshData={() => {
            queryClient.invalidateQueries(["user", "list"]);
          }}
          detail={detailData}
        />
      )}
    </div>
  );
});

export default ChampionPage;
