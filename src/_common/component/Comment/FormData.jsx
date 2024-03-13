import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, message, Spin, TextArea } from "remix-dls";
import { CommentApi } from "states/api";
// redux

export default function FormData({ onGetList, object_id, object_type = "" }) {
  const [form] = Form.useForm();

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables, object_id, object_type };
      return CommentApi.create({ params: newValues });
    },
    {
      onSuccess: (res) => {
        if (typeof onGetList === "function") {
          onGetList();
        }
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  const handleSubmitForm = (values) => {
    if (!object_id) return message.error("Vui chọn một đối tượng để bình luận");
    if (!values?.content) return message.error("Vui lòng nhập bình luận");
    mutate(values);
    return null;
  };

  return (
    <Spin spinning={isLoading} tip="loading....">
      <Form
        form={form}
        layout="vertical"
        className="remix-form-cms"
        onFinish={handleSubmitForm}
        initialValues={{}}
      >
        <Form.Item name="content">
          <TextArea
            autoSize={{ minRows: 3, maxRows: 10 }}
            showCount
            placeholder="Nhập nội dung"
          />
        </Form.Item>
        <div className="comment-footer">
          {/* <Upload>
          <Button className="btn-upload">
            <FontAwesomeIcon icon={faPaperclip} />
            Thêm file đính kèm
          </Button>
        </Upload> */}
          <span />
          <Button htmlType="submit" className="btn-info">
            Gửi
          </Button>
        </div>
      </Form>
    </Spin>
  );
}
