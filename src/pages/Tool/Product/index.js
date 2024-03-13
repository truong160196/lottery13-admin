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
  Image,
  formatCurrency,
} from "remix-dls";
import i18next from "i18next";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { usePermission } from "_common/hooks/usePermission";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faStar } from "@fortawesome/free-solid-svg-icons";
import { ProductApi } from "states/api/product";

import Filter from "./Filter";
import CreateUpdateModal from "./CreateUpdateModal";

const ProductPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [location]);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  const { data, isLoading, refetch } = useQuery(
    ["product", "list", filters],
    () =>
      ProductApi.getList({
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
      return ProductApi.delete({ id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["product", "list"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại";
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
    if (!item?.id) return message.error("Không tìm thấy dữ liệu cần xóa");

    Modal.confirm({
      title: "Xác nhận xóa dữ liệu",
      cancelText: "Hủy",
      okText: "Xóa",
      onOk: () => {
        onDelete(item?.id);
      },
      content: (
        <>
          <p>
           Bạn có chắc chắn xóa dữ liệu sản phẩm {item?.name}
          </p>
        </>
      ),
    });

    return null;
  };

  if (!isAdmin)
    return (
      <div className="remix-page">
        <Empty description="Không có quyền truy cập" />
      </div>
    );

  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <div className="remix-sub-header">
            <h2 className="remix-page-title">Danh sách phần quà</h2>
            <div className="remix-page-control">
              {isAdmin && (
                <Button className="btn-control btn-success" onClick={() => setOpenModalCreate(true)}>
              Thêm phần quà
                </Button>
              )}
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
                },
                {
                  key: "avatar_url",
                  title: "Hình ảnh",
                  dataIndex: "avatar_url",
                  width: "10%",
                  render: (value) => <Image width={60} src={value} />,
                },
                {
                  key: "name",
                  title: "Tên phần quà",
                  dataIndex: "name",
                  width: "25%",
                },
                {
                  key: "price",
                  title: "Giá trị phần quà",
                  dataIndex: "price",
                  width: "20%",
                  render: (value, rows) => (
                    formatCurrency(value)
                  ),
                },
                {
                  key: "created_at",
                  title: "Thời gian tạo",
                  dataIndex: "created_at",
                  width: "20%",
                  render: (value) => formatDate(value, "DD/MM/YYYY HH:mm:ss"),
                },
                {
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  title: "Thao tác",
                  hide: !isAdmin,
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button className="btn-info" onClick={() => handelOpenModal(item)}>
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                        <Button className="btn-danger" onClick={() => handleDeleteRow(item)}>
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
            queryClient.invalidateQueries(["product", "list"]);
          }}
        />
      )}
    </div>
  );
});

export default ProductPage;
