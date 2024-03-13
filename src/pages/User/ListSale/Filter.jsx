import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  getQueryParams,
  Input,
  Radio,
  Select,
  TextArea,
  updateQueryParams,
} from "remix-dls";
// redux
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { coinTypeText, paymentStatusText } from "_common/constants/statusType";

const Filter = ({ setParams, params }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    if (!params) return;
    form.setFieldsValue({ ...params });
  }, [params]);

  const onCloseFilter = () => {
    form.resetFields();
    setParams({});
  };

  const handleFilterSubmit = (values) => {
    setParams({ ...params, ...values, page: 1 });
  };

  const handleKeyup = (event, key) => {
    if (event?.keyCode === 13) {
      if (key === "filter") {
        form2.submit();
      } else {
        form.submit();
      }
    }
  };

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
      <Form form={form} className="remix-filter" onFinish={handleFilterSubmit}>
        <Form.Item name="keyword" className="input-search">
          <Input
            prefix={<FontAwesomeIcon icon={faSearch} />}
            placeholder="Tìm kiếm ..."
            onKeyUp={(e) => handleKeyup(e)}
          />
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="Chọn 1 lựa chọn"
            value={period}
            onChange={(value) => setPeriod(value)}
            style={{ width: 140 }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="today">Hôm nay</Select.Option>
            <Select.Option value="week">Tuần này</Select.Option>
            <Select.Option value="half_month">15 Ngày trước</Select.Option>
            <Select.Option value="month">Tháng này</Select.Option>
            <Select.Option value="prev_month">Tháng trước</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Radio.Group className="mb-12" value={period}>
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
                  start_date: value && moment(value).format("DD/MM/YYYY"),
                })
              }
              placeholder="Từ ngày"
              format="DD/MM/YYYY"
            />
            <DatePicker
              style={{ width: 200 }}
              value={
                params?.end_date ? moment(params?.end_date, "DD/MM/YYYY") : null
              }
              onChange={(value) =>
                setParams({
                  ...params,
                  end_date: value && moment(value).format("DD/MM/YYYY"),
                })
              }
              placeholder="Đến ngày"
              format="DD/MM/YYYY"
            />
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button
            className="btn-secondary btn-search-filter"
            onClick={() => form.submit()}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          {Object.keys(params)?.length > 0 && (
            <Button
              className="btn-danger btn-search-filter ml-6"
              onClick={() => onCloseFilter()}
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};

export default Filter;
