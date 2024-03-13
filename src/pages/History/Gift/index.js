import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
  message,
  Tag,
  formatNumber,
  Menu,
  getQueryParams,
  updateQueryParams,
  Modal,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { giftStatusText, statusColor } from "_common/constants/statusType";
import { GiftApi } from "states/api/gift";
import { usePermission } from "_common/hooks/usePermission";
import Filter from "./Filter";
import CreateUpdateModal from "./CreateUpdateModal";

const GiftPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const [listChecked, setCheckData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const { data: dataState, isLoading, refetch } = useQuery(
    ["gift", "list", filters],
    () =>
      GiftApi.getList({
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

  useEffect(() => {
    refetch();
  }, []);

  const data = dataState?.data;
  const summary = dataState?.summary;

  const dataReport = useMemo(() => {
    if (!summary) return {};
    const result = {};
    summary.forEach((element) => {
      if (element?.status) {
        result[element.status] = element;
      }
    });

    return result;
  }, [summary]);

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (ids) => {
      return GiftApi.delete({ params: { ids } });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["gift", "list"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handelOpenModal = (item) => {
    setDetailItem(item);
    setOpenModalCreate(true);
  };

  const handelCLoseModal = () => {
    setDetailItem(null);
    setOpenModalCreate(false);
  };

  const handleDeleteRow = (ids) => {
    if (!ids?.length) return message.error("Không tìm thấy thông tin cần xoá");

    Modal.confirm({
      title: "Xác nhận xoá quà tặng",
      cancelText: "Huỷ",
      okText: "Xoá",
      onOk: () => {
        onDelete(ids);
      },
      content: (
        <>
          <p>
            Bạn có chắc chắn muốn xoá {ids?.length > 1 ? ids?.length : ""} dòng
            này
          </p>
        </>
      ),
    });

    return null;
  };

  const menus = (
    <Menu className="action-menu">
      <Menu.Item key="1" onClick={() => handleDeleteRow(listChecked)}>
        Xoá
      </Menu.Item>
      <Menu.Item key="3" onClick={() => setCheckData([])}>
        Bỏ chọn tất cả
      </Menu.Item>
    </Menu>
  );

  const handleCheckList = (ids) => {
    setCheckData(ids);
  };

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
            <h2 className="remix-page-title">Quản lý quà tặng</h2>
            <div className="remix-page-control">
              <Button
                className="btn-control btn-success"
                onClick={() => setOpenModalCreate(true)}
              >
                Thêm quà tặng
              </Button>
            </div>
          </div>
          {isAdmin && (
            <div className="page-overview">
              <div className="static-number mb-24">
                <div className="card-static">
                  <p>Hàng đợi</p>
                  <h1>{formatNumber(get(dataReport, "ready.total", 0))}</h1>
                </div>
                <div className="card-static">
                  <p>Chờ bốc thăm</p>
                  <h1>{formatNumber(get(dataReport, "pending.total", 0))}</h1>
                </div>
                <div className="card-static">
                  <p>Đã nhận quà</p>
                  <h1>{formatNumber(get(dataReport, "complete.total", 0))}</h1>
                </div>
                <div className="card-static">
                  <p>Vi phạm</p>
                  <h1>{formatNumber(get(dataReport, "error.total", 0))}</h1>
                </div>
              </div>
            </div>
          )}
          <Card>
            <Filter />
            <GridView
              column={[
                {
                  key: "id",
                  title: "ID",
                  dataIndex: "id",
                  width: "5%",
                },
                {
                  key: "code",
                  title: "Tài khoản",
                  dataIndex: "code",
                  width: "20%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p>
                            <span className="hide-mobile">Biệt danh:</span>{" "}
                            {rows?.user?.username}
                          </p>
                          <p className="hide-mobile">
                            Tên:
                            {rows?.user?.full_name}
                          </p>
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "product_id",
                  title: "Sản phẩm",
                  dataIndex: "product_id",
                  width: "30%",
                  render: (value, item) => {
                    return <>{item?.product_name}</>;
                  },
                },
                {
                  key: "status",
                  title: "Trạng thái",
                  dataIndex: "status",
                  width: "10%",
                  render: (value) => {
                    return (
                      <Tag color={statusColor[value]}>
                        {giftStatusText[value]}
                      </Tag>
                    );
                  },
                },
                {
                  key: "created_at",
                  title: "Thời gian",
                  dataIndex: "created_at",
                  width: "10%",
                  render: (value) => formatDate(value, "DD/MM/YYYY HH:mm:ss"),
                },
                {
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  title: "Tác vụ",
                  hide: !isAdmin,
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button
                          className="btn-sm"
                          onClick={() => handelOpenModal(item)}
                        >
                          Thao tác
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
              showCheckbox={isAdmin}
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
          detail={detailItem}
          onClose={handelCLoseModal}
          onRefreshData={() => {
            queryClient.invalidateQueries(["gift", "list"]);
          }}
        />
      )}
    </div>
  );
});

export default GiftPage;
