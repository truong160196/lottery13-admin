import { useQuery } from "@tanstack/react-query";
import { Button, Radio, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  Card,
  Col,
  DatePicker,
  DateRangePicker,
  Divider,
  Empty,
  Form,
  formatNumber,
  get,
  Row,
  Spin,
} from "remix-dls";
import { GameApi } from "states/api/game";
import { formatMoney } from "_common/utils/formatValue";
import { usePermission } from "_common/hooks/usePermission";

const periodText = {
  all: "Tất cả",
  today: "Trong ngày hôm nay",
  week: "Trong 7 ngày qua",
  month: "Trong tháng nay",
  half_month: "Trong 15 ngày qua",
  prev_month: "Trong tháng trước",
};

const Report = () => {
  const { isAdmin } = usePermission();
  const navigate = useNavigate();
  const [params, setParams] = useState({
    start_date: null,
    end_date: null,
  });
  const [period, setPeriod] = useState("all");

  const { data, isLoading, refetch } = useQuery(
    ["dashboard", "report", params],
    () =>
      GameApi.getStatic({
        params: {
          ...params,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const dataReport = useMemo(() => {
    if (!data?.length) return {};
    const result = {};
    data.forEach((element) => {
      result[element?.type] = element;
    });
    return result;
  }, [data]);

  useEffect(() => {
    let start_date = null;
    let end_date = null;
    switch (period) {
      case "all":
        start_date = null;
        end_date = null;
        break;
      case "today":
        start_date = moment().format("DD/MM/YYYY");
        end_date = null;
        break;
      case "week":
        start_date = moment()
          .startOf("week")
          .format("DD/MM/YYYY");
        end_date = moment()
          .endOf("week")
          .format("DD/MM/YYYY");
        break;
      case "month":
        start_date = moment()
          .startOf("month")
          .format("DD/MM/YYYY");
        end_date = moment()
          .endOf("month")
          .format("DD/MM/YYYY");
        break;
      case "half_month":
        start_date = moment()
          .subtract(15, "days")
          .format("DD/MM/YYYY");
        end_date = moment().format("DD/MM/YYYY");
        break;
      case "prev_month":
        start_date = moment()
          .subtract(1, "month")
          .startOf("month")
          .format("DD/MM/YYYY");
        end_date = moment()
          .subtract(1, "month")
          .endOf("month")
          .format("DD/MM/YYYY");
        break;
      default:
        start_date = null;
        end_date = null;
        break;
    }

    setParams({
      start_date,
      end_date,
    });
  }, [period]);

  return (
    <>
      <div className="remix-page">
        <div className="main-content-inner">
          <div className="page-container">
            <Spin spinning={isLoading} tip="Đang tải ....">
              <div className="static-number big-size mb-24 mt-24">
                <div className="card-static">
                  <p>Trạng thái</p>
                  <p className="sub-title">Hôm nay</p>
                  <h3 className="mt-12">
                    <span className="online" />
                    Trực tuyến
                  </h3>
                </div>
                <div className="card-static">
                  <p>Người đăng ký</p>
                  <h1>{formatNumber(dataReport?.register_total?.total)}</h1>
                </div>
                <div className="card-static">
                  <p>Đã xác minh</p>
                  <h1>{formatNumber(dataReport?.verify?.total)}</h1>
                </div>
                <div className="card-static">
                  <p>Đại lý</p>
                  <h1>{formatNumber(dataReport?.agency?.total)}</h1>
                </div>
              </div>

              <Row>
                <Col xs={24}>
                  <Card>
                    <h5 className="mb-0 text-gray">{periodText[period]}</h5>
                    <Divider className="mt-6 mb-6" />
                    <Radio.Group className="mb-12" value={period}>
                      <Radio value="all" onClick={() => setPeriod("all")}>
                        Tất cả
                      </Radio>
                      <Radio value="today" onClick={() => setPeriod("today")}>
                        Hôm nay
                      </Radio>
                      <DatePicker
                        style={{ width: 200, marginRight: 15 }}
                        value={
                          params?.start_date
                            ? moment(params?.start_date, "DD/MM/YYYY")
                            : null
                        }
                        onChange={(value) =>
                          setParams({
                            ...params,
                            start_date:
                              value && moment(value).format("DD/MM/YYYY"),
                          })
                        }
                        placeholder="Từ ngày"
                        format="DD/MM/YYYY"
                      />
                      <DatePicker
                        style={{ width: 200 }}
                        value={
                          params?.end_date
                            ? moment(params?.end_date, "DD/MM/YYYY")
                            : null
                        }
                        onChange={(value) =>
                          setParams({
                            ...params,
                            end_date:
                              value && moment(value).format("DD/MM/YYYY"),
                          })
                        }
                        placeholder="Đến ngày"
                        format="DD/MM/YYYY"
                      />
                    </Radio.Group>
                  </Card>
                </Col>
                {isAdmin && (
                  <Col xs={12} md={12}>
                    <Card>
                      <h5 className="text-gray">Thông kê giao dịch</h5>
                      <Row>
                        <Col xs={24} md={12}>
                          <p className="mb-0">Tổng nạp</p>
                          <h5 className="mb-0">
                            <b>
                              {formatNumber(
                                Number(get(dataReport, "deposit.total", 0))
                              )}
                            </b>
                          </h5>
                        </Col>
                        <Col xs={24} md={12}>
                          <p className="mb-0">Tổng rút</p>
                          <h5 className="mb-0">
                            <b>{formatNumber(dataReport?.withdraw?.total)}</b>
                          </h5>
                        </Col>
                        <Col xs={24} md={12}>
                          <p className="mb-0">Tổng hoa hồng</p>
                          <h5 className="mb-0">
                            <b>{formatNumber(dataReport?.commission?.total)}</b>
                          </h5>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                )}

                <Col xs={12} md={12}>
                  <Card className="remix-card shadow-sm mb-12">
                    <h5 className="text-gray">Thống kê Game</h5>
                    <Row>
                      <Col xs={24} md={12}>
                        <p className="mb-0">Tổng giao dịch đặt cược</p>
                        <h5 className="mb-0">
                          <b>{formatNumber(dataReport?.total_bet?.total)}</b>
                        </h5>
                      </Col>
                      <Col xs={24} md={12}>
                        <p className="mb-0">Tổng giao dịch trả thưởng</p>
                        <h5 className="mb-0">
                          <b>
                            {formatNumber(dataReport?.total_payback?.total)}
                          </b>
                        </h5>
                      </Col>
                      <Col xs={24} md={12}>
                        <p className="mb-0">Tổng lợi nhuận</p>
                        <h5 className="mb-0">
                          <b>{formatNumber(dataReport?.profit?.total)}</b>
                        </h5>
                      </Col>
                    </Row>
                  </Card>
                  <Card>
                    <h5 className="text-gray">Số dư người dùng còn lại</h5>
                    <Row>
                      <Col xs={24} md={12}>
                        <p className="mb-0">Tổng số dư người dùng</p>
                        <h5 className="mb-0">
                          <b>{formatNumber(dataReport?.game?.total)}</b>
                        </h5>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Spin>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
