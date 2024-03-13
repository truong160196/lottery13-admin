import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { NotificationApi } from "states/api";
import { Empty, formatDate, Spin } from "remix-dls";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "../MediaQueryProvider";

const LeftNotification = () => {
  const navigate = useNavigate();
  const { isMobile } = useMediaQuery();

  const { data: dataList, isLoading } = useQuery(
    ["notification", "list"],
    () =>
      NotificationApi.getList({
        params: {
          page: 1,
          limit: 10,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  const renderBody = useMemo(() => {
    if (!dataList?.data?.length)
      return <Empty description="Không có dữ liệu" />;
    return dataList?.data?.map((item) => {
      return (
        <div
          className="item"
          key={item?.id}
          onClick={() => navigate(`/mail?mail_id=${item?.id}`)}
        >
          <p className="time">
            {formatDate(item?.created_at, "DD/MM/YYYY HH:mm:ss")}
          </p>
          <h5>{item?.title}</h5>
          <p className="btn-more">Bấm để xem chi tiết</p>
        </div>
      );
    });
  }, [dataList]);

  if (isMobile) return <></>;

  return (
    <div className="notification-container">
      <div className="notify-header">
        <FontAwesomeIcon icon={faBell} />
        <h5>Thông báo</h5>
      </div>
      <div className="notify-body">
        <Spin tip="loading..." spinning={isLoading}>
          {renderBody}
        </Spin>
      </div>
    </div>
  );
};

export default LeftNotification;
