import React from "react";
import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  TextArea,
} from "remix-dls";
import SelectSale from "_common/component/SelectSale";
import { genderText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";

export default function FormData({ id, position_key, item }) {
  const { isAdmin } = usePermission();

  return (
    <>
      <Form.Item
        label="Tên người dùng"
        name="full_name"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên nhân viên",
          },
        ]}
      >
        <Input placeholder="Nhập tên nhân viên" />
      </Form.Item>
      <Form.Item name="rate1" label="Tỷ lệ đặt cược">
        <InputNumber min={0} placeholder="Nhập tỷ lệ cược" />
      </Form.Item>
      <Form.Item name="phone" label="Số điện thoại">
        <Input placeholder="Số điện thoại" />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input placeholder="Email" />
      </Form.Item>
      {item?.position_key === "agency" && (
        <Form.Item name="link_zalo" label="Link CSKH của Đại lý (sale)">
          <Input placeholder="Link CSKH của Đại lý (sale)" />
        </Form.Item>
      )}
      {!id && (
        <>
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên đăng nhập",
              },
            ]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu đăng nhập"
            help="để trống nếu để mật khẩu mặc định"
          >
            <Input placeholder="Mật khẩu đăng nhập" />
          </Form.Item>
        </>
      )}
      {isAdmin && (
        <>
          {position_key === "sale" && (
            <Form.Item name="agency_id" label="Đại lý Tổng">
              <SelectSale
                defaultParam={{
                  position_key: "agency",
                }}
                style={{
                  minWidth: 250,
                }}
                placeholder="Chọn đại lý"
              />
            </Form.Item>
          )}
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
    </>
  );
}
