import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Spin,
  Form,
  Input,
  message,
  Row,
  Col,
  InputNumber,
  Radio,
  Space,
  Switch,
  Checkbox,
} from "remix-dls";

import { get } from "lodash";

import TextArea from "antd/lib/input/TextArea";
import { OptionApi } from "states/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UploadCustom from "_common/component/UploadCustom";

const type = "general";

export default function FormData() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [logoImage, setLogoImage] = useState([]);

  const isLoading = false;

  const { data: dataState } = useQuery(
    ["config", "list", type],
    () => {
      const params = {
        type,
        page: 1,
        limit: 100,
      };

      return OptionApi.getList({
        params,
      });
    },
    {
      staleTime: 300000,
    }
  );

  const { mutate: onSubmit, isLoading: isSubmitLoading } = useMutation(
    (variable) => {
      return OptionApi.create({
        params: {
          ...variable,
        },
      });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["config", "list", "general"]);
        message.success(res?.data?.msg || "Thao tác thành công!");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  useEffect(() => {
    const options = dataState?.data;
    if (!options) return;
    const newsValue = {};

    options.forEach((item, index) => {
      newsValue[item.name] = item.value;
      if (item.value === "0") {
        newsValue[item.name] = false;
      }
    });

    // logo
    const findLogo = options?.find((obj) => obj?.name === "logo");

    const imageData = get(findLogo, "image_url", "");
    setLogoImage([
      {
        url: imageData,
      },
    ]);

    form.setFieldsValue(newsValue);
  }, [dataState]);

  const handleSubmitForm = (values) => {
    const newValues = [];

    Object.keys(values).map((item, key) => {
      const formValue = {
        name: item,
        value: values[item],
        type: "general",
      };

      newValues.push(formValue);
      return null;
    });

    onSubmit({
      data: newValues,
      list: true,
    });
  };

  const handleImageLogo = (images) => {
    form.setFieldsValue({
      logo: get(images[0], "url"),
    });
  };

  return (
    <Spin tip="Loading ..." spinning={isLoading || isSubmitLoading}>
      <Form
        layout="vertical"
        className="form-cms"
        style={{ marginTop: 0 }}
        onFinish={handleSubmitForm}
        initialValues={{}}
        form={form}
      >
        <Row>
          <Col xs={24} sm={12} md={8} lg={6}>
            <h5 className="form-title">
              <b>Thiết lập website</b>
            </h5>
            <Form.Item label="Mã giới thiệu" name="ref_no">
              <Input placeholder="Mã giới thiệu" />
            </Form.Item>
            <Form.Item label="Thông báo rút thăm" name="lucky_note">
              <TextArea
                autoSize={{ minRows: 2 }}
                placeholder="Thông báo rút thăm"
              />
            </Form.Item>
            <Form.Item label="Thông báo chào mừng trang chủ" name="home_note">
              <TextArea
                autoSize={{ minRows: 2 }}
                placeholder="Thông báo chào mừng trang chủ"
              />
            </Form.Item>
            <Form.Item label="Thông báo rút tiền trang chủ" name="notice_note">
              <TextArea
                autoSize={{ minRows: 2 }}
                placeholder="Thông báo rút tiền trang chủ"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <h5 className="form-title">
              <b>Thiết lập Min Rút / Nạp</b>
            </h5>
            <Form.Item label="Min nạp tiền" name="min_deposit">
              <InputNumber
                placeholder="Min nạp tiền"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
            <Form.Item label="Max nạp tiền" name="max_deposit">
              <InputNumber
                placeholder="Max nạp tiền"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
            <Form.Item label="Min rút tiền" name="min_withdraw">
              <InputNumber
                placeholder="Min rút tiền"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
            <Form.Item label="Max rút tiền" name="max_withdraw">
              <InputNumber
                placeholder="Max rút tiền"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <h5 className="form-title">
              <b>Thiết lập trò chơi</b>
            </h5>
            <Form.Item label="Số tiền cược mặc định" name="bet_default">
              <InputNumber
                placeholder="Số tiền cược mặc định"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
            <Form.Item label="Số tiền cược tối thiểu" name="min_bet">
              <InputNumber
                placeholder="Số tiền cược tối thiểu"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
            <Form.Item label="Số tiền cược tối đa" name="max_bet">
              <InputNumber
                placeholder="Số tiền cược tối đa"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <h5 className="form-title">
              <b>Cấu hình website</b>
            </h5>
            <Form.Item label="Tên website" name="name_website">
              <Input placeholder="Tên website" />
            </Form.Item>
            <Form.Item label="Link CSKH mặc định" name="link_support">
              <Input placeholder="Gắn link zalo, facebook, telegram" />
            </Form.Item>
            <Form.Item label="Logo" name="logo">
              <UploadCustom
                fileList={logoImage}
                onReceiveImages={handleImageLogo}
                multiple={false}
                maxImages={1}
                folder="setting"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            style={{ width: 120 }}
            type="submit"
            className="btn-secondary"
            onClick={() => form.submit()}
          >
            Lưu cấu hình
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
}
