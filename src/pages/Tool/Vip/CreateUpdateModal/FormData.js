import React from "react";
import {
  Col,
  DatePicker,
  Form,
  get,
  Input,
  InputNumber,
  Row,
  Select,
  TextArea,
} from "remix-dls";
import UploadCustom from "_common/component/UploadCustom";
import { genderText } from "_common/constants/statusType";

export default function FormData({ logoImage, handleImageLogo }) {
  return (
    <>
      <Form.Item
        label="Mã chức danh"
        name="code"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mã chức danh",
          },
        ]}
      >
        <Input placeholder="Nhập mã chức danh" />
      </Form.Item>

      <Form.Item
        label="Tên chức danh"
        name="name"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mã tên chức danh",
          },
        ]}
      >
        <Input placeholder="Nhập tên chức danh" />
      </Form.Item>
      <Form.Item
        name="score"
        label="Điểm cấp độ"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập điểm cấp độ",
          },
        ]}
        help="Vui lòng nhập số điểm theo thứ tự tăng dần"
      >
        <InputNumber
          placeholder="Nhập điểm cấp độ"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
        />
      </Form.Item>
      <Form.Item
        name="order"
        label="Cấp độ"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập cấp độ",
          },
        ]}
        help="Vui lòng nhập cấp theo thứ tự tăng dần"
      >
        <InputNumber
          placeholder="Nhập cấp độ"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
        />
      </Form.Item>
      <Form.Item label="Hình đai diện" name="logo">
        <UploadCustom
          fileList={logoImage}
          onReceiveImages={handleImageLogo}
          multiple={false}
          maxImages={1}
          folder="vip"
        />
      </Form.Item>
    </>
  );
}
