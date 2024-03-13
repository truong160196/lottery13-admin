import React, { useEffect, useState, useMemo } from "react";
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
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faEye,
  faLock,
  faBank,
} from "@fortawesome/free-solid-svg-icons";
import { GameApi } from "states/api/game";

import CreateUpdateModal from "../CreateUpdateModal";
import UpdateAccount from "../UpdateAccount";
import Filter from "./Filter";
import ListBankModal from "../ListBankModal";
import ListBossModal from "../ListBossModal";
import ListRefUser from "../ListRefUser";
import { useNotify } from "_common/component/NotifyProvider";

const ListUser = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { pushNotify } = useNotify();
  const [searchParams] = useSearchParams();
  const sale_id = searchParams.get("sale_id");
  const position_key = searchParams.get("position_key");

  const [params, setParams] = useState({});

  const { data, isLoading, refetch } = useQuery(
    ["user", "list", sale_id, params],
    () =>
      UserApi.getList({
        params: {
          page: 1,
          limit: 10,
          position_key: "user",
          sale_id,
          ...params,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  const { data: reportState, refetch: getReport } = useQuery(
    ["dashboard", "report_user", sale_id, params],
    () =>
      GameApi.getStatic({
        params: {
          ...params,
          sale_id,
          position_key,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  useEffect(() => {
    getReport();
    refetch();
  }, []);

  const dataReport = useMemo(() => {
    if (!reportState?.length) return {};
    const result = {};
    reportState.forEach((element) => {
      result[element?.type] = element;
    });
    return result;
  }, [reportState]);

  const { mutate: onReset } = useMutation(
    () => {
      return UserApi.reset({ params: {} });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["user", "list"]);
        pushNotify({
          type: "update_user",
        });
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (ids) => {
      return UserApi.delete({
        params: {
          ids,
        },
      });
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

  const { mutate: onUpdate, isLoading: updateLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables };
      return UserApi.update({ id: variables?.id, params: newValues });
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

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openUpdateAccount, setModalUpdateAccount] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);
  const [openBossMOdal, setOpenBossModal] = useState(false);
  const [openUserRef, setOpenUserRef] = useState(false);
  const [detailData, setDetailData] = useState();

  const onOpenUpdateModal = (item) => {
    setOpenModalCreate(true);
    setDetailData(item);
  };

  const onOpenChangePasswordModal = (item) => {
    setModalUpdateAccount(true);
    setDetailData(item);
  };

  const openModalBank = (item) => {
    setOpenBankModal(true);
    setDetailData(item);
  };

  const openModalBoss = (item) => {
    setOpenBossModal(true);
    setDetailData(item);
  };

  const openRefModal = (item) => {
    setOpenUserRef(true);
    setDetailData(item);
  };

  const onCloseModal = (item) => {
    setOpenBankModal(false);
    setOpenModalCreate(false);
    setModalUpdateAccount(false);
    setOpenBossModal(false);
    setOpenUserRef(false);
    setDetailData(null);
  };

  const handleChangeMarketing = (item) => {
    onUpdate({ id: item?.id, is_marketing: item?.is_marketing === 0 ? 1 : 0 });
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
            <h2 className="remix-page-title">Người dùng</h2>
            <div className="remix-page-control">
              {isAdmin && (
                <>
                  <Popconfirm
                    placement="top"
                    title="Tất cả tỷ lệ cược sẽ reset về mặc định của game!"
                    onConfirm={() => onReset()}
                    okText="Xác nhận"
                    cancelText="Huỷ"
                  >
                    <Button className="btn-control btn-info">
                      Reset cược người dùng
                    </Button>
                  </Popconfirm>

                  <Button
                    className="btn-control btn-success"
                    onClick={() => setOpenModalCreate(true)}
                  >
                    Tạo tài khoản
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="page-overview">
            <div className="static-number mb-24">
              <div className="card-static">
                <p>Tổng tiền nạp</p>
                <h1>{formatNumber(get(dataReport, "deposit.total", 0))}</h1>
              </div>
              <div className="card-static">
                <p>Tổng tiền rút</p>
                <h1>{formatNumber(get(dataReport, "withdraw.total", 0))}</h1>
              </div>
              <div className="card-static">
                <p>Tổng cược</p>
                <h1>{formatNumber(get(dataReport, "total_bet.total", 0))}</h1>
              </div>
            </div>
          </div>
          <Card>
            <Filter setParams={setParams} params={params} />
            <GridView
              column={[
                {
                  key: "code",
                  title: "Tài khoản",
                  dataIndex: "code",
                  width: "25%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p>ID: {rows?.id}</p>
                          <p>Tài khoản: {rows?.username}</p>
                          <p>IP: {rows?.ip}</p>
                          <p>
                            Rút tiền:{" "}
                            <Tag color={statusColor[rows?.is_withdraw]}>
                              {statusText[rows?.is_withdraw]}
                            </Tag>
                          </p>
                          <p>
                            Đặt cược:
                            <Tag color={statusColor[rows?.is_bet]}>
                              {statusText[rows?.is_bet]}
                            </Tag>{" "}
                          </p>
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "username",
                  title: "Thông tin nhóm",
                  dataIndex: "username",
                  width: "15%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p>
                            Tỷ lệ cược: {formatNumber(rows?.rate1, "0,0.000")}
                          </p>
                          <p>
                            Mã mời: <b>{rows?.ref_no}</b>
                          </p>
                          <p style={{ marginBottom: 12 }}>
                            <Button
                              className="full-width"
                              onClick={() => openRefModal(rows)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span style={{ marginLeft: 6 }}>F1-F7</span>
                            </Button>
                          </p>
                          <p
                            role="presentation"
                            style={{ marginBottom: 12 }}
                            onClick={() => openModalBoss(rows)}
                          >
                            <Button className="btn-success full-width">
                              Xem cấp trên
                            </Button>
                          </p>
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "tokens",
                  title: "Số dư",
                  dataIndex: "tokens",
                  width: "12%",
                  render: (value, rows) => {
                    return <>{formatNumber(rows?.balance)}</>;
                  },
                },
                {
                  key: "status",
                  title: "Thống kê",
                  dataIndex: "status",
                  width: "20%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p>
                            *Tổng NẠP:{" "}
                            <span style={{ color: "green" }}>
                              <b>{formatNumber(rows?.bill_deposit)}</b>
                            </span>
                          </p>
                          <p>
                            *Tổng RÚT:{" "}
                            <span style={{ color: "red" }}>
                              <b>{formatNumber(rows?.bill_withdraw)}</b>
                            </span>
                          </p>
                          <p>
                            *Tổng CHƠI:{" "}
                            <span style={{ color: "orange" }}>
                              <b>{formatNumber(rows?.game_amount)}</b>
                            </span>
                          </p>
                          <p>
                            *Tổng THẮNG:{" "}
                            <span style={{ color: "green" }}>
                              <b>{formatNumber(rows?.game_win)}</b>
                            </span>
                          </p>
                          <p>
                            *Tổng THUA:{" "}
                            <span style={{ color: "red" }}>
                              <b>{formatNumber(rows?.game_loss)}</b>
                            </span>
                          </p>
                          <p>
                            *LỜI:{" "}
                            <span style={{ color: "green" }}>
                              <b>{formatNumber(rows?.game_profit)}</b>
                            </span>
                          </p>
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "created_at",
                  title: "Ngày tạo",
                  dataIndex: "created_at",
                  width: "8%",
                  render: (value) => formatDate(value, "DD/MM/YYYY"),
                },
                {
                  key: "actions",
                  dataIndex: "id",
                  align: "right",
                  hide: !isAdmin,
                  render: (id, item) => {
                    return (
                      <div className="btn-group">
                        <Button
                          className="btn-sm btn-secondary"
                          onClick={() => openModalBank(item)}
                        >
                          <FontAwesomeIcon icon={faBank} />
                        </Button>
                        <Button
                          className="btn-sm btn-primary"
                          onClick={() => onOpenChangePasswordModal(item)}
                        >
                          <FontAwesomeIcon icon={faLock} />
                        </Button>
                        <Button
                          className="btn-sm btn-info"
                          onClick={() => onOpenUpdateModal(item)}
                        >
                          <FontAwesomeIcon icon={faPen} />
                        </Button>
                        <Popconfirm
                          placement="top"
                          title="Bạn có chắc chắn muốn xoá dữ liệu này không?"
                          onConfirm={() => onDelete([id])}
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
              showTitleMobile={false}
              data={data?.data || []}
              pagination={{
                current: parseInt(get(data, "current_page"), 10) || 1,
                pageSize: parseInt(get(data, "per_page"), 10) || 10,
                total: get(data, "total"),
                onChange: (page, pageSize) => {
                  setParams({
                    ...params,
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
            requests={{
              position_key: "user",
            }}
            visible={openModalCreate}
            onClose={onCloseModal}
            onRefreshData={() => {
              refetch();
            }}
            detail={detailData}
          />
        )}
        {openUpdateAccount && (
          <UpdateAccount
            visible={openUpdateAccount}
            onClose={onCloseModal}
            onRefreshData={() => {
              refetch();
            }}
            detail={detailData}
          />
        )}
        {openBankModal && (
          <ListBankModal
            visible={openBankModal}
            onClose={onCloseModal}
            onRefreshData={() => {
              refetch();
            }}
            detail={detailData}
          />
        )}
        {openBossMOdal && (
          <ListBossModal
            visible={openBossMOdal}
            onClose={onCloseModal}
            onRefreshData={() => {
              refetch();
            }}
            detail={detailData}
          />
        )}
        {openUserRef && (
          <ListRefUser
            visible={openUserRef}
            onClose={onCloseModal}
            onRefreshData={() => {
              refetch();
            }}
            detail={detailData}
          />
        )}
      </div>
    </div>
  );
});

export default ListUser;
