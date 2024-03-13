import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useLocation, useNavigate } from "react-router-dom";
import { usePermission } from "_common/hooks/usePermission";
import {
  gameBetText,
  gameStatusColor,
  gameStatusText,
  gameTypeBetText,
  gameTypeText,
} from "_common/constants/statusType";
import { GamePlayerApi } from "states/api/gamePlayer";
import CreateUpdateModal from "./CreateUpdateModal";

const ListData = ({ data, isLoading, showCheckbox = true, setParams }) => {
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

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (ids) => {
      return GamePlayerApi.delete({ params: { ids } });
    },
    {
      onSuccess: (res) => {
        setCheckData([]);
        queryClient.invalidateQueries(["game-player", "list"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleDeleteRow = (ids) => {
    if (!ids?.length) return message.error("Không tìm thấy thông tin cần xoá");

    Modal.confirm({
      title: "Xác nhận xóa lịch sử",
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

  const handelOpenModal = (item) => {
    setDetailItem(item);
    setOpenModalCreate(true);
  };

  const handelCLoseModal = () => {
    setDetailItem(null);
    setOpenModalCreate(false);
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
            width: "10%",
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
            width: "12%",
            render: (value, rows) => {
              return (
                <>
                  <p>
                    <b>{gameTypeText[rows?.game?.category]}</b>
                  </p>
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
            width: "8%",
            render: (value, rows) => {
              return (
                <>{gameBetText[rows?.game_bet_text] || rows?.game_bet_text}</>
              );
            },
          },
          {
            key: "amount",
            title: "Tiền cược",
            dataIndex: "amount",
            width: "12%",
            render: (value) => formatNumber(value),
          },
          {
            key: "amount_payback",
            title: "Thắng / Thua",
            dataIndex: "amount_payback",
            width: "12%",
            render: (value) => {
              return (
                <p style={{ color: value > 0 ? "green" : "red" }}>
                  {formatNumber(value)}
                </p>
              );
            },
          },
          {
            key: "status",
            title: "Trạng thái",
            dataIndex: "status",
            width: "10%",
            render: (value) => {
              return (
                <>
                  <p style={{ color: gameStatusColor[value] }}>
                    <b>{gameStatusText[value]}</b>
                  </p>
                </>
              );
            },
          },
          {
            key: "phone",
            title: "Kết quả",
            dataIndex: "phone",
            width: "10%",
            render: (value, rows) => {
              return (
                <div className="list-item">
                  <p>
                    <b>{get(rows, "game.total_number", "-")} |</b>
                    {get(rows, "game.number1", "-")},
                    {get(rows, "game.number2", "-")},
                    {get(rows, "game.number3", "-")},{get(rows, "game.number4")}
                    ,{get(rows, "game.number5")}
                  </p>
                </div>
              );
            },
          },
          {
            key: "created_at",
            title: "Thời gian",
            dataIndex: "created_at",
            width: "10%",
            render: (value) =>
              value && formatDate(value, "DD/MM/YYYY HH:mm:ss"),
          },
          // {
          //   key: "actions",
          //   dataIndex: "id",
          //   align: "right",
          //   title: "Tác vụ",
          //   hide: !isAdmin,
          //   render: (id, item) => {
          //     return (
          //       <div className="btn-group">
          //         <Button
          //           className="btn-sm"
          //           onClick={() => handelOpenModal(item)}
          //         >
          //           Thao tác
          //         </Button>
          //       </div>
          //     );
          //   },
          // },
        ]}
        data={data?.data || []}
        pagination={{
          current: parseInt(get(data, "current_page"), 10) || 1,
          pageSize: parseInt(get(data, "per_page"), 10) || 10,
          total: get(data, "total"),
          onChange: (page, pageSize) => {
            if (typeof setParams === "function") {
              setParams({
                page,
                limit: pageSize,
              });
            } else {
              const urlString = updateQueryParams({
                ...filters,
                page,
                limit: pageSize,
              });
              navigate({
                pathname: window.location.pathname,
                search: urlString,
              });
            }
          },
        }}
        showCheckbox={isAdmin && showCheckbox}
        onCheckBox={handleCheckList}
        defaultCheckbox={listChecked}
        menuCheckbox={menus}
        loading={isLoading || deleteLoading}
      />
      {openModalCreate && (
        <CreateUpdateModal
          visible={openModalCreate}
          detail={detailItem}
          onClose={handelCLoseModal}
          onRefreshData={() => {
            queryClient.invalidateQueries(["game-player", "list"]);
          }}
        />
      )}
    </>
  );
};

export default ListData;
