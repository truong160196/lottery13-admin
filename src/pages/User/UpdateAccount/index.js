import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  Spin,
  Form,
  Modal,
  message,
  Input,
  Select,
  Checkbox,
} from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";

import { get } from "lodash";

export default function UpdateAccount({
  visible,
  onClose,
  onRefreshData,
  detail,
}) {
  const [form] = Form.useForm();

  const [type, setType] = useState();

  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
      birthday: detail?.birthday && moment(detail?.birthday),
      identify_date: detail?.identify_date && moment(detail?.identify_date),
    });
  }, [form, detail]);

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables, type };
      return UserApi.updateAccount({ id: detail?.id, params: newValues });
    },
    {
      onSuccess: (res) => {
        onClose();
        if (typeof onRefreshData === "function") {
          onRefreshData();
        }
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleCancel = () => {
    onClose(false);
    form.resetFields();
  };

  return (
    <Modal
      visible={visible}
      title={detail?.id ? "Cập nhật người dùng" : "Tạo mới người dùng"}
      onCancel={() => handleCancel()}
      maskClosable={false}
      closable={false}
      footer={[
        <>
          <Button
            disabled={isLoading}
            className="btn-default"
            onClick={() => handleCancel()}
          >
            Hủy
          </Button>
          <Button
            disabled={isLoading}
            className="btn-success"
            onClick={() => form.submit()}
          >
            Cập nhật
          </Button>
        </>,
      ]}
    >
      <Spin tip="Loading" spinning={isLoading}>
        <Form
          layout="vertical"
          className="form-cms"
          style={{ marginTop: 0 }}
          onFinish={mutate}
          initialValues={{}}
          form={form}
        >
          <Form.Item label="Hành động">
            <Select placeholder="Chọn hành động" onChange={setType}>
              <Select.Option value="block_withdraw">
                Khoá rút tiền
              </Select.Option>
              <Select.Option value="block_bet">Khoá đặt cược</Select.Option>
              <Select.Option value="active_user">
                Xoá bỏ tất cả trạng thái khoá
              </Select.Option>
              <Select.Option value="block_user">
                Hạn chế tài khoản
              </Select.Option>
              <Select.Option value="reset_password">
                Reset mật khẩu
              </Select.Option>
              <Select.Option value="update_username">
                Cập nhật username
              </Select.Option>
              <Select.Option value="change_password">
                Thay đổi mật khẩu
              </Select.Option>
              <Select.Option value="change_wallet_password">
                Thay đổi mật khẩu giao dich
              </Select.Option>
              <Select.Option value="update_login">
                Thay đổi trạng thái tài khoản
              </Select.Option>
              <Select.Option value="update_ref_no">
                Thay đổi mã giới thiệu
              </Select.Option>
              <Select.Option value="update_permission">
                Cập nhật quyền tài khoản
              </Select.Option>
            </Select>
          </Form.Item>
          {type === "reset_password" && (
            <Form.Item>
              <p>
                Tài khoản sẽ reset lại mật khẩu mặc định là 123456 và gửi về
                email tài khoản
              </p>
            </Form.Item>
          )}
          {type === "update_username" && (
            <Form.Item label="Tên đăng nhập" name="username">
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>
          )}
          {type === "change_password" && (
            <Form.Item name="new_password" label="Mật khẩu đăng nhập">
              <Input placeholder="Mật khẩu đăng nhập" />
            </Form.Item>
          )}
          {type === "change_wallet_password" && (
            <Form.Item name="new_wallet_password" label="Mật khẩu giao dịch">
              <Input placeholder="Mật khẩu giao dịch" />
            </Form.Item>
          )}
          {type === "update_login" && (
            <Form.Item name="status" label="Trạng thái thài khoản">
              <Select placeholder="Chọn trạng thái">
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Tạm khoá</Select.Option>
              </Select>
            </Form.Item>
          )}
          {type === "update_permission" && (
            <>
              <Form.Item name="is_admin" label="Quyền tài khoản">
                <Select placeholder="Chọn quyền tài khoản">
                  <Select.Option value={2}>Tài khoản thường</Select.Option>
                  <Select.Option value={1}>Quản trị viên</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="position_key"
                label="Chức danh"
                help="Nếu quyền tài khoản là Nhân viên vui lòng chọn chức vụ cho tài khoản"
              >
                <Select placeholder="Chọn chức vụ">
                  <Select.Option value="agency">Đại lý</Select.Option>
                  <Select.Option value="sale">Sale</Select.Option>
                  <Select.Option value="user">Người dùng</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Spin>
    </Modal>
  );
}
