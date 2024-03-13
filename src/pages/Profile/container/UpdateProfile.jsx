import React, { useEffect, useState } from "react";
import { get, omit } from "lodash";
import moment from "moment";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UploadCustom from "_common/component/UploadCustom";
import { useStores } from "_common/hooks";
import {
  DatePicker,
  Form,
  Button,
  Spin,
  Row,
  Col,
  Select,
  TextArea,
  Input,
  Card,
  message,
} from "remix-dls";
import { genderText } from "_common/constants/statusType";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { ProfileApi } from "states/api";

const UpdateProfile = observer(() => {
  const {
    authStore: { user },
  } = useStores();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [images, setListImages] = useState([]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      return ProfileApi.update({ params: variables });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["get_profile"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      ...user,
      birthday: user?.birthday && moment(user?.birthday),
      identify_date: user?.identify_date && moment(user?.identify_date),
    });
    const avatarUrl = user?.avatar_url;
    setListImages([
      {
        url: avatarUrl,
      },
    ]);
  }, [form, user]);

  const handleReceiveImg = (images) => {
    form.setFieldsValue({
      avatar: get(images[0], "url"),
    });
  };

  const handleSubmit = (values) => {
    mutate(values);
  };

  return (
    <Spin tip="Loading ..." spinning={isLoading}>
      <Form
        layout="vertical"
        className="form-cms"
        style={{ marginTop: 0 }}
        initialValues={{}}
        form={form}
        onFinish={handleSubmit}
      >
        <Card title="Thông tin cá nhân">
          <Row>
            <Col xs={24} md={8}>
              <div className="flex flex-content-center py-24">
                <Form.Item name="avatar">
                  <UploadCustom
                    fileList={images}
                    onReceiveImages={handleReceiveImg}
                    multiple={false}
                    maxImages={1}
                    folder="avatar"
                  />
                </Form.Item>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item
                name="full_name"
                label="Tên nhân viên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên nhân viên",
                  },
                ]}
              >
                <TextArea
                  autoSize={{ minRows: 1 }}
                  placeholder="Nhập tên nhân viên"
                />
              </Form.Item>
              <Form.Item name="birthday" label="Ngày sinh">
                <DatePicker placeholder="Nhập ngày sinh" format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item name="gender" label="Giới tính">
                <Select placeholder="Chọn giới tính">
                  {Object.keys(genderText).map((key, index) => (
                    <Select.Option
                      key={`item-${index.toString()}`}
                      value={Number(key)}
                    >
                      {genderText[key]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item name="phone" label="SĐT">
                <Input placeholder="Nhập SĐT" />
              </Form.Item>
              <Form.Item label="Telegram" name="link_telegram">
                <Input placeholder="Telegram" />
              </Form.Item>
              <Form.Item label="Zalo" name="link_zalo">
                <Input placeholder="Zalo" />
              </Form.Item>
              <Form.Item label="Facebook" name="link_facebook">
                <Input placeholder="Facebook" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
        <div className="btn-footer-form ">
          <Button
            className="btn-primary"
            type="submit"
            onClick={() => form.submit()}
          >
            Gửi chỉnh sửa
          </Button>
        </div>
      </Form>
    </Spin>
  );
});

export default UpdateProfile;
