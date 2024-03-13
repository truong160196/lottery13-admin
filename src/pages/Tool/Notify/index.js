import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
  message,
  Empty,
  getQueryParams,
  updateQueryParams,
  Modal,
  formatNumber,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryApi } from "states/api";
import { useLocation, useNavigate } from "react-router-dom";
import { usePermission } from "_common/hooks/usePermission";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NotificationApi } from "states/api/notification";

import Filter from "./Filter";
import CreateUpdateModal from "./CreateUpdateModal";

const NotifyPage = observer(() => {
  const { isAdmin, isSale, isAgency } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const [listChecked, setCheckData] = useState([]);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const { data, isLoading, refetch } = useQuery(
    ["notification", "list", filters],
    () =>
      NotificationApi.getList({
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

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (id) => {
      return NotificationApi.delete({ id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["notification", "list"]);
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

  const handleDeleteRow = (item) => {
    if (!item?.id) return message.error("Không tìm thấy thông tin cần xoá");

    Modal.confirm({
      title: "Xác nhận xóa thông báo",
      cancelText: "Huỷ",
      okText: "Xoá",
      onOk: () => {
        onDelete(item?.id);
      },
      content: (
        <>
          <p>
            Bạn có chắc chắn muốn xoá thông báo <b>{item?.name}</b> không?
          </p>
        </>
      ),
    });

    return null;
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
            <h2 className="remix-page-title">Danh sách thông báo</h2>
            <div className="remix-page-control">
              <Button
                className="btn-control btn-success"
                onClick={() => setOpenModalCreate(true)}
              >
                Thêm thông báo
              </Button>
            </div>
          </div>
          <Card>
            <Filter />
            <GridView
              column={[
                {
                  key: "id",
                  title: "ID",
                  dataIndex: "id",
                  width: "5%",
                  className: "hide-mobile",
                },
                {
                  key: "title",
                  title: "Tiêu đề",
                  dataIndex: "title",
                  width: "15%",
                },
                {
                  key: "content",
                  title: "Nội dung",
                  dataIndex: "content",
                  width: "50%",
                },
                {
                  key: "created_at",
                  title: "Thời gian",
                  dataIndex: "created_at",
                  width: "15%",
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
                        <Button
                          className="btn-info"
                          onClick={() => handelOpenModal(item)}
                        >
                          <FontAwesomeIcon icon={faPenAlt} />
                        </Button>
                        <Button
                          className="btn-danger"
                          onClick={() => handleDeleteRow(item)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
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
            queryClient.invalidateQueries(["notification", "list"]);
          }}
        />
      )}
    </div>
  );
});

export default NotifyPage;
