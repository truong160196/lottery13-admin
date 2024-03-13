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

const Filter = ({ setParams, params }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params) return;
    form.setFieldsValue({ ...params });
  }, [params]);

  const onCloseFilter = () => {
    form.resetFields();
    setParams({ page: 1 });
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
          <Button
            className="btn-secondary btn-search-filter"
            onClick={() => form.submit()}
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Tìm kiếm</span>
          </Button>
        </Form.Item>
        {Object.keys(params)?.length > 0 && (
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
