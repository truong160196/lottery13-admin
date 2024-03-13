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
  faRotate,
  faSearch,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  coinTypeText,
  gameStatusText,
  gameStatusTypeText,
  paymentStatusText,
} from "_common/constants/statusType";
import { useStores } from "_common/hooks";

const Filter = ({ onGetList }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const {
    authStore: { games },
  } = useStores();
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
    const urlString = updateQueryParams({
      ...filters,
      ...values,
      timeUpdate: new Date().getTime(),
      page: 1,
    });
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
        <Form.Item name="game_code">
          <Select
            placeholder="Chọn game"
            style={{ width: 200 }}
            onChange={() => form.submit()}
          >
            <Select.Option value="">Tất cả</Select.Option>
            {games.map((item, index) => {
              return (
                <Select.Option
                  key={`item-${index.toString()}`}
                  value={item?.code}
                >
                  {item?.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="game_status">
          <Select
            placeholder="Chọn trạng thái game"
            onChange={() => form.submit()}
          >
            <Select.Option value="">Tất cả</Select.Option>
            {Object.keys(gameStatusTypeText).map((item, index) => {
              return (
                <Select.Option key={`item-${index.toString()}`} value={item}>
                  {gameStatusTypeText[item]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="status">
          <Select
            placeholder="Chọn thạng thái đặt cược"
            onChange={() => form.submit()}
          >
            <Select.Option value="">Tất cả</Select.Option>
            {Object.keys(gameStatusText).map((item, index) => {
              return (
                <Select.Option key={`item-${index.toString()}`} value={item}>
                  {gameStatusText[item]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            className="btn-secondary btn-search-filter mr-6"
            onClick={() => form.submit()}
          >
            <FontAwesomeIcon icon={faSearch} />
          </Button>
          {Object.keys(filters)?.length > 0 && (
            <Button
              className="btn-danger btn-search-filter mr-6"
              onClick={() => onCloseFilter()}
            >
              <FontAwesomeIcon icon={faFilterCircleXmark} />
            </Button>
          )}
          <Button
            className="btn-primary btn-search-filter"
            onClick={() => form.submit()}
          >
            <FontAwesomeIcon icon={faRotate} />
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Filter;
