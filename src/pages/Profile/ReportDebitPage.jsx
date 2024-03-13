import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  formatNumber,
  Tabs,
  Pagination,
  get,
  Empty,
  Spin,
  formatCurrency,
} from "remix-dls";
import { observer } from "mobx-react";
import UpdateProfile from "pages/Profile/container/UpdateProfile";
import { useQuery } from "@tanstack/react-query";
import { CustomerApi } from "states/api";

const ReportDebitPage = observer(() => {
  const [activeKey, setActiveKey] = useState("sale");

  const { data, isLoading, refetch } = useQuery(
    ["dashboard", "report"],
    () =>
      CustomerApi.getReport({
        params: {},
      }),
    {
      staleTime: 300000,
      enabled: false,
    }
  );
  const salesData = get(data, "sales", []) || [];
  const debtData = get(data, "dept", []) || [];
  const cancelData = get(data, "cancel", []) || [];

  useEffect(() => {
    refetch();
  }, []);

  const handleChangeTab = (key) => {
    setActiveKey(key);
  };

  const ReportSale = () => {
    if (!salesData?.length) return <Empty description="Không có dữ liệu" />;
    return (
      <ul className="grid-data">
        <li>
          <span>
            <b>Tên khách hàng</b>
          </span>
          <span>
            <b>Doanh thu:</b> ĐVT: vnđ
          </span>
        </li>
        <Spin tip="Loading..." spinning={isLoading}>
          {salesData?.map((item) => {
            return (
              <li key={item?.customer_id}>
                <span>{item?.name}</span>
                <span>{formatCurrency(item?.final_amount)}</span>
              </li>
            );
          })}
        </Spin>
      </ul>
    );
  };

  const ReportDebt = () => {
    if (!debtData?.length) return <Empty description="Không có dữ liệu" />;
    return (
      <ul className="grid-data">
        <li>
          <span>
            <b>Tên khách hàng</b>
          </span>
          <span>
            <b>Công nợ:</b> ĐVT: vnđ
          </span>
        </li>
        <Spin tip="Loading..." spinning={isLoading}>
          {debtData?.map((item) => {
            return (
              <li key={item?.customer_id}>
                <span>{item?.name}</span>
                <span>{formatCurrency(item?.final_amount)}</span>
              </li>
            );
          })}
        </Spin>
      </ul>
    );
  };

  const ReportCancel = () => {
    if (!cancelData?.length) return <Empty description="Không có dữ liệu" />;
    return (
      <ul className="grid-data">
        <li>
          <span>
            <b>Tên khách hàng</b>
          </span>
          <span>
            <b>Giá trị:</b> ĐVT: vnđ
          </span>
        </li>
        <Spin tip="Loading..." spinning={isLoading}>
          {cancelData?.map((item) => {
            return (
              <li key={item?.customer_id}>
                <span>{item?.name}</span>
                <span>{formatCurrency(item?.final_amount)}</span>
              </li>
            );
          })}
        </Spin>
      </ul>
    );
  };

  const ListSale = () => {
    return (
      <div className="box">
        <div className="title">
          <h5>Tình hình khách hàng</h5>
        </div>
        <ReportSale />
        <div className="mt-12">
          <Pagination total={salesData?.length} />
        </div>
      </div>
    );
  };

  const ListDebit = () => {
    return (
      <div className="box">
        <div className="title">
          <h5>Tình hình công nợ</h5>
        </div>
        <ReportDebt />
        <div className="mt-12">
          <Pagination total={debtData?.length} />
        </div>
      </div>
    );
  };

  const ListCancel = () => {
    return (
      <div className="box">
        <div className="title">
          <h5>Danh sách đơn huỷ</h5>
        </div>
        <ReportCancel />
        <div className="mt-12">
          <Pagination total={cancelData?.length} />
        </div>
      </div>
    );
  };

  const Body = () => {
    switch (activeKey) {
      case "save":
        return <ListSale />;
      case "debit":
        return <ListDebit />;
      case "cancel":
        return <ListCancel />;
      default:
        return <ListSale />;
    }
  };

  return (
    <>
      <div className="header-title-inner title mb-0">
        <div className="title">
          <h4>Theo dõi công nợ</h4>
        </div>
      </div>
      <Tabs
        defaultValue={activeKey}
        className="tab-header"
        onChange={handleChangeTab}
      >
        <Tabs.TabPane key="sale" tab="Doanh thu" />
        <Tabs.TabPane key="debit" tab="Công nợ" />
        <Tabs.TabPane key="cancel" tab="Đơn huỷ" />
      </Tabs>
      <div className="main-layout-inner">
        <div className="pb-24">
          <Body />
        </div>
      </div>
    </>
  );
});

export default ReportDebitPage;
