import React, { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  get,
  GridView,
  Popconfirm,
  message,
  Empty,
  formatNumber,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { GameApi } from "states/api/game";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faBank,
  faEye,
  faLock,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import CreateUpdateModal from "../CreateUpdateModal";
import UpdateAccount from "../UpdateAccount";
import Filter from "./Filter";
import ListBankModal from "../ListBankModal";
import ListBossModal from "../ListBossModal";
import ModalAddUser from "../ModalAddUser";

const ListSale = observer(() => {
  const { role, isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [params, setParams] = useState({
    start_date: null,
    end_date: null,
  });

  const { data, isLoading, refetch } = useQuery(
    ["user", "sale", params],
    () =>
      UserApi.getList({
        params: {
          page: 1,
          limit: 10,
          position_key: "sale",
          ...params,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  const { data: reportState, refetch: getReport } = useQuery(
    ["dashboard", "report_sale", params],
    () =>
      GameApi.getStatic({
        params: {
          ...params,
          position_key: "sale",
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

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (ids) => {
      return UserApi.delete({ params: { ids } });
    },
    {
      onSuccess: (res) => {
        refetch();
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
  const [openBossMOdal, setOpenBossModal] = useState(false);
  const [openAddUser, setModalAddUser] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);
  const [detailData, setDetailData] = useState();

  const onOpenUpdateModal = (item) => {
    setOpenModalCreate(true);
    setDetailData(item);
  };

  const onOpenChangePasswordModal = (item) => {
    setModalUpdateAccount(true);
    setDetailData(item);
  };

  const onOpenUserRef = (item) => {
    // setOpenUserRef(true);
    // setDetailData(item);
    navigate(`/users/list?sale_id=${item?.id}&position_key=agency`);
  };

  const openModalBoss = (item) => {
    setOpenBossModal(true);
    setDetailData(item);
  };

  const openModalAddUser = (item) => {
    setModalAddUser(true);
    setDetailData(item);
  };

  const openModalBank = (item) => {
    setOpenBankModal(true);
    setDetailData(item);
  };

  const onCloseModal = (item) => {
    setOpenModalCreate(false);
    setModalUpdateAccount(false);
    setOpenBossModal(false);
    setOpenBankModal(false);
    setModalAddUser(false);
    setDetailData(null);
  };

  if (role !== "admin" && role !== "agency")
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
            <h2 className="remix-page-title">Đại lý Sale</h2>
            <div className="remix-page-control">
              <Button
                className="btn-control btn-success"
                onClick={() => setOpenModalCreate(true)}
              >
                Thêm Sale
              </Button>
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
            <Filter params={params} setParams={setParams} />
            <GridView
              column={[
                {
                  key: "code",
                  title: "Thông tin",
                  dataIndex: "code",
                  width: "40%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p>ID: {rows?.id}</p>
                          <p>Tài khoản: {rows?.username}</p>
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "code",
                  title: "Tổng thành viên",
                  dataIndex: "code",
                  width: "15%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p
                            role="presentation"
                            style={{ marginBottom: 12 }}
                            onClick={() => openModalBoss(rows)}
                          >
                            <Button className="btn-success">
                              Xem cấp trên
                            </Button>
                          </p>
                          <p>
                            <Button
                              className="btn-info"
                              onClick={() => onOpenUserRef(rows)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span style={{ marginLeft: 6 }}>
                                {rows?.total_ref} thành viên
                              </span>
                            </Button>
                          </p>
                        </div>
                      </>
                    );
                  },
                },
                {
                  key: "status",
                  title: "Mã giới thiệu",
                  dataIndex: "status",
                  width: "15%",
                  render: (value, rows) => {
                    return (
                      <>
                        <div>
                          <p>
                            <b>{rows?.ref_no}</b>
                          </p>
                        </div>
                      </>
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
                        <Button
                          className="btn-sm btn-info"
                          onClick={() => openModalAddUser(item)}
                        >
                          <FontAwesomeIcon icon={faUserPlus} />
                        </Button>
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
            requests={{ is_agency: 1, position_key: "sale" }}
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
        {openAddUser && (
          <ModalAddUser
            visible={openAddUser}
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

export default ListSale;
