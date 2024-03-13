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
  Modal,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaymentApi } from "states/api/payment";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  paymentStatusText,
  statusColor,
  statusText,
} from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import Filter from "./Filter";
import PaymentDetailModal from "../PaymentDetailModal";

const DepositPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const [listChecked, setCheckData] = useState([]);
  const [openModalDetail, setModalDetail] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState(null);

  const { data: dataState, isLoading, refetch } = useQuery(
    ["payment", "list_deposit", filters],
    () =>
      PaymentApi.getList({
        params: {
          page: 1,
          limit: 10,
          type: "deposit",
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
      if (element?.type) {
        result[element.type] = element;
      }
    });

    return result;
  }, [summary]);

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (ids) => {
      return PaymentApi.delete({ params: { ids } });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["payment", "list_deposit"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handelOpenModal = (item) => {
    setPaymentDetail(item);
    setModalDetail(true);
  };

  const handelCLoseModal = () => {
    setPaymentDetail(null);
    setModalDetail(false);
  };

  const handleDeleteRow = (ids) => {
    if (!ids?.length) return message.error("Không tìm thấy thông tin cần xoá");

    Modal.confirm({
      title: "Xác nhận khách hàng",
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
            <h2 className="remix-page-title">Danh sách nạp tiền</h2>
          </div>
          {isAdmin && (
            <div className="page-overview">
              <div className="static-number mb-24">
                <div className="card-static">
                  <p>Tổng tiền nạp</p>
                  <h1>{formatNumber(get(dataReport, "deposit.amount", 0))}</h1>
                </div>
                <div className="card-static">
                  <p>Tổng tiền nạp ngày hôm nay</p>
                  <h1>
                    {formatNumber(get(dataReport, "deposit_today.amount", 0))}
                  </h1>
                </div>
                <div className="card-static">
                  <p>Tổng số lệnh đang chờ</p>
                  <h1>{formatNumber(get(dataReport, "pending.total", 0))}</h1>
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
                  width: "15%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p className="hide-mobile">Mã HĐ: {rows?.ref_no}</p>
                          <p>
                            <span className="hide-mobile">Biệt danh:</span>{" "}
                            {rows?.sender?.username}
                          </p>
                          <p className="hide-mobile">
                            Tên:
                            {rows?.sender?.full_name}
                          </p>
                          {rows?.note && <p>Mô tả: {rows?.note}</p>}
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "token_id",
                  title: "Phương thức",
                  dataIndex: "token_id",
                  width: "10%",
                  render: (value, item) => {
                    return <>{item?.token?.name}</>;
                  },
                },
                {
                  key: "amount",
                  title: "Số tiền",
                  dataIndex: "amount",
                  width: "15%",
                  render: (value) => formatNumber(value),
                },
                {
                  key: "content",
                  title: "Nội dung",
                  dataIndex: "content",
                  width: "15%",
                },
                {
                  key: "status",
                  title: "Trạng thái",
                  dataIndex: "status",
                  width: "10%",
                  render: (value) => {
                    return (
                      <Tag color={statusColor[value]}>
                        {paymentStatusText[value]}
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
      {openModalDetail && (
        <PaymentDetailModal
          visible={openModalDetail}
          detail={paymentDetail}
          onClose={handelCLoseModal}
          onRefreshData={() => {
            queryClient.invalidateQueries(["payment", "list_deposit"]);
          }}
        />
      )}
    </div>
  );
});

export default DepositPage;
