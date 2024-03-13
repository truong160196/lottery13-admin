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
  formatNumber,
  Checkbox,
  Image,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VipApi } from "states/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

import CreateUpdateModal from "./CreateUpdateModal";

const ListVipPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [params, setParams] = useState({});

  const { data, isLoading, refetch } = useQuery(
    ["vip", "list", params],
    () =>
      VipApi.getList({
        params: {
          page: 1,
          limit: 10,
          ...params,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (id) => {
      return VipApi.delete({ id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["vip", "list"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [detailData, setDetailData] = useState();

  const onOpenUpdateModal = (item) => {
    setOpenModalCreate(true);
    setDetailData(item);
  };

  const onCloseModal = (item) => {
    setOpenModalCreate(false);
    setDetailData(null);
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
            <h2 className="remix-page-title">Danh sách chức danh</h2>
            <div className="remix-page-control">
              <Button
                className="btn-control btn-success"
                onClick={() => setOpenModalCreate(true)}
              >
                Tạo chức danh
              </Button>
            </div>
          </div>

          <Card>
            <GridView
              column={[
                {
                  key: "code",
                  title: "Mã chức danh",
                  dataIndex: "code",
                  width: "10%",
                },
                {
                  key: "name",
                  title: "Tên chức danh",
                  dataIndex: "name",
                  width: "20%",
                },
                {
                  key: "score",
                  title: "Điểm cấp độ",
                  dataIndex: "score",
                  width: "20%",
                  render: (value) => formatNumber(value),
                },
                {
                  key: "order",
                  title: "Cấp độ",
                  dataIndex: "order",
                  width: "15%",
                },
                {
                  key: "image_url",
                  title: "Hình đại diện",
                  dataIndex: "image_url",
                  render: (value) => <Image height={30} src={value} />,
                },
                {
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  width: "10%",
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button
                          className="btn-sm btn-info"
                          onClick={() => onOpenUpdateModal(item)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                        <Popconfirm
                          placement="top"
                          title="Bạn có chắc chắn muốn xoá dữ liệu này không?"
                          onConfirm={() => onDelete(id)}
                          okText="Xác nhận"
                          cancelText="Huỷ"
                        >
                          <Button className="btn-sm btn-danger">
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </Popconfirm>
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
                onChange: (page, pageSize) => {
                  setParams({
                    page,
                    limit: pageSize,
                  });
                },
              }}
              loading={isLoading || deleteLoading}
            />
          </Card>
        </div>
        {openModalCreate && (
          <CreateUpdateModal
            visible={openModalCreate}
            onClose={onCloseModal}
            onRefreshData={() => {
              queryClient.invalidateQueries(["vip", "list"]);
            }}
            detail={detailData}
          />
        )}
      </div>
    </div>
  );
});

export default ListVipPage;
