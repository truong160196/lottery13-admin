import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Drawer,
  Form,
  getQueryParams,
  Input,
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { coinTypeText, paymentStatusText } from "_common/constants/statusType";

const Filter = ({ onGetList }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  useEffect(() => {
    if (!filters) return;
    form.setFieldsValue({ ...filters });
  }, [filters]);

  const onCloseFilter = () => {
    form.resetFields();
    navigate({
      pathname: window.location.pathname,
    });
  };

  const handleFilterSubmit = (values) => {
    const urlString = updateQueryParams({ ...filters, ...values, page: 1 });
    navigate({
      pathname: window.location.pathname,
      search: urlString,
    });
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
        <Form.Item name="status">
          <Select placeholder="Chọn trạng thái">
            {Object.keys(paymentStatusText).map((item, index) => {
              return (
                <Select.Option key={`item-${index.toString()}`} value={item}>
                  {paymentStatusText[item]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="coin">
          <Select placeholder="Chọn loại tiền">
            {Object.keys(coinTypeText).map((item, index) => {
              return (
                <Select.Option key={`item-${index.toString()}`} value={item}>
                  {coinTypeText[item]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            className="btn-secondary btn-search-filter"
            onClick={() => form.submit()}
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Tìm kiếm</span>
          </Button>
        </Form.Item>
        {Object.keys(filters)?.length > 0 && (
          <Button
            className="btn-danger btn-search-filter"
            onClick={() => onCloseFilter()}
          >
            <FontAwesomeIcon icon={faFilterCircleXmark} />
          </Button>
        )}
      </Form>
    </>
  );
};

export default Filter;
