import React, { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, Form, Input, Modal } from "remix-dls";
import { UserOutlined } from "@ant-design/icons";

export default function RegisterComponent() {
  const [form] = Form.useForm();

  const [openModal, setOpenModal] = useState(false);

  const handleRegister = (values) => {
    console.log(values);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className="auth-form-user"
        onFinish={handleRegister}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Nhập Số điện thoại",
            },
            {
              min: 9,
              message: "Vui lòng nhập một số điện thoại",
            },
            {
              max: 12,
              message: "Vui lòng nhập một số điện thoại",
            },
          ]}
        >
          <Input placeholder="Nhập Số điện thoại" type="tel" pattern="[0-9]*" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Nhập mật khẩu",
            },
            {
              min: 6,
              message: "Nhập tối thiểu 6 ký tự",
            },
          ]}
        >
          <Input.Password placeholder="Mật Khẩu" allowClear />
        </Form.Item>
        <Form.Item
          name="confirmed"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Mật khẩu không thể bỏ trông",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không trùng khớp"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập Lại Mật khâu" allowClear />
        </Form.Item>
        <div className="policy">
          <Checkbox>Đồng ý với</Checkbox>
          <span className="policy-text" onClick={() => setOpenModal(true)}>
            điều khoản dịch vụ
          </span>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="btn-auth">
            <UserOutlined />
            <span>Đăng Ký</span>
          </Button>
        </Form.Item>
      </Form>
      <div className="help">
        <p>Độ dài mật khẩu từ 6 - 20 ký tự</p>
        <p>Ví dụ:</p>
        <p>Mật khẩu : 123456</p>
      </div>
      {openModal && (
        <Modal
          className="modal-policy"
          visible={openModal}
          width={680}
          onCancel={() => setOpenModal(false)}
          footer={
            <>
              <Button
                className="btn-primary"
                onClick={() => setOpenModal(false)}
              >
                OK
              </Button>
            </>
          }
        >
          <h4>
            <strong> Quy định chung</strong>
          </h4>
          <p>
            Người vay phải trong độ tuổi từ 19- 60 , có tài khoản ngân hàng
            chính chủ hoặc có thể mượn người thân , có CMT hoặc thẻ căn cước ,
            phải cung cấp số điện thoại chính chủ , facebook hay zalo chính chủ
            và số liên hệ ít nhất của một người thân
          </p>
          <p>
            BẢO LÂM FINANCIAL sẽ thẩm định đợt vay đầu tiên của bạn trong vòng
            30 phút – 1 tiếng. Với các đơn vay tiếp theo sau khi bạn đã được vay
            , thời gian thẩm định chỉ 5 phút
          </p>
          <p>
            BẢO LÂM FINANCIAL sé thẩm đinh các thông tin của bạn cung cấp ,cung
            cấp càng nhiều thông tin , bạn càng dễ được vay. Cùng với đó , mức
            tín nhiệm của bạn cũng tăng , các khoản vay của bạn có thể được
            duyệt với giá trị lớn hơn , phí và lãi suất thấp hơn , thời gian vay
            dài hơn
          </p>
          <p>
            Bất kỳ thông tin không chính xác hoặc không rõ ràng nào cũng có thể
            làm đơn vay của bạn bị từ chối
          </p>
          <p>
            Vui lòng liên hệ tới sự hỗ trợ của BẢO LÂM FINANCIAL để được hỗ trợ
          </p>
        </Modal>
      )}
    </>
  );
}
