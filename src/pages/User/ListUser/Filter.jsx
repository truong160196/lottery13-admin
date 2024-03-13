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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faSearch,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import SelectSale from "_common/component/SelectSale";

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
        <Form.Item name="sale_id">
          <SelectSale
            defaultParam={{
              position_key: "sale",
            }}
            style={{
              minWidth: 160,
            }}
            placeholder="Chọn đại lý"
          />
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
