import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  get,
  Input,
  Row,
  Select,
  TextArea,
} from "remix-dls";
import UploadCustom from "_common/component/UploadCustom";
import { championType, genderText } from "_common/constants/statusType";

export default function FormData({ form }) {
  const [images, setListImages] = useState([]);

  const handleReceiveImg = (images) => {
    form.setFieldsValue({
      avatar: get(images[0], "url"),
    });
  };

  return (
    <>
      <Row>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tên giải đấu"
            name="full_name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên giải đấu",
              },
            ]}
          >
            <Input placeholder="Nhập tên giải đấu" />
          </Form.Item>
          <Form.Item name="start_date" label="Ngày bắt đầu">
            <DatePicker placeholder="Nhập ngày bắt đầu" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="end_date" label="Ngày kết thúc">
            <DatePicker placeholder="Nhập ngày kết thúc" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="type" label="Loại giải đấu">
            <Select placeholder="Chọn giới tính">
              {Object.keys(championType).map((key, index) => (
                <Select.Option
                  key={`item-${index.toString()}`}
                  value={Number(key)}
                >
                  {championType[key]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="avatar" label="Hình nền giải đấu">
            <UploadCustom
              fileList={images}
              onReceiveImages={handleReceiveImg}
              multiple={false}
              folder="champion"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="identify_number" label="Tiền thưởng top 1">
            <Input placeholder="Tiền thưởng top 1" />
          </Form.Item>
          <Form.Item>
            <Button className="btn-primary">Thêm mốc thưởng</Button>
          </Form.Item>
          <Form.Item name="content" label="Nội dung giải đấu">
            <TextArea
              autoSize={{ minRows: 10 }}
              placeholder="Nội dung giải đấu"
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}
