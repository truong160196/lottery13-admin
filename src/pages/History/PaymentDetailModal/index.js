import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  Spin,
  Form,
  Modal,
  message,
  TextArea,
  Tag,
  formatNumber,
  formatDate,
  Divider,
} from "remix-dls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentApi } from "states/api/payment";
import {
  paymentStatusText,
  paymentTypeText,
  statusColor,
} from "_common/constants/statusType";
import { optionBank } from "_common/constants/bank";
import { useStores } from "_common/hooks";
import { useNotify } from "_common/component/NotifyProvider";

export default function PaymentDetailModal({
  visible,
  onClose,
  onRefreshData,
  detail,
}) {
  const {
    authStore: { isAdmin },
  } = useStores();
  const [form] = Form.useForm();
  const { pushNotify } = useNotify();
  useEffect(() => {
    if (!form) return;
    form.setFieldsValue({
      ...detail,
    });
  }, [form, detail]);

  const [typeApprove, setTypeApprove] = useState("");

  const { mutate, isLoading } = useMutation(
    (variables) => {
      const newValues = { ...variables };
      return PaymentApi.updateStatus({ id: detail?.id, params: newValues });
    },
    {
      onSuccess: (res) => {
        onClose();
        if (typeof onRefreshData === "function") {
          onRefreshData();
        }
        pushNotify({
          type: "update_user",
        });
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

  const handleSubmit = (values) => {
    if (!typeApprove) return message.error("Vui lòng chọn hình thức");
    mutate({
      ...values,
      type: detail?.type,
      status: typeApprove,
    });

    return null;
  };

  return (
    <Modal
      className="remix-modal-form"
      visible={visible}
      title={`Thông tin giao dịch ${detail?.ref_no}`}
      onCancel={() => handleCancel()}
      footer={[
        <>
          {isAdmin && detail?.status === "pending" && (
            <>
              <Button
                className="btn-danger"
                onClick={() => {
                  setTypeApprove("reject");
                  form.submit();
                }}
              >
                Từ chối
              </Button>
              <Button
                className="btn-success"
                onClick={() => {
                  setTypeApprove("approve");
                  form.submit();
                }}
              >
                Xác nhận
              </Button>
            </>
          )}
        </>,
      ]}
    >
      <Spin tip="Loading" spinning={isLoading}>
        <Form
          layout="vertical"
          className="form-cms"
          style={{ marginTop: 0 }}
          onFinish={handleSubmit}
          initialValues={{}}
          form={form}
        >
          <Form.Item>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Mã đơn hàng: </b>
                  </td>
                  <td>{detail?.ref_no}</td>
                </tr>
                <tr>
                  <td>
                    <b>Tài khoản: </b>
                  </td>
                  <td>
                    {detail?.sender?.username} / {detail?.sender?.full_name}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Phương thức: </b>
                  </td>
                  <td>{detail?.token?.name}</td>
                </tr>
                {detail?.transfer?.name && (
                  <tr>
                    <td>
                      <b>Đến phương thức: </b>
                    </td>
                    <td>{detail?.transfer?.name}</td>
                  </tr>
                )}
                <tr>
                  <td>
                    <b>Loại giao dịch: </b>
                  </td>
                  <td>{paymentTypeText[detail?.type]}</td>
                </tr>
                <tr>
                  <td>
                    <b>Trạng thái: </b>
                  </td>
                  <td>
                    <Tag color={statusColor[detail?.status]}>
                      {paymentStatusText[detail?.status]}
                    </Tag>
                  </td>
                </tr>
                {detail?.type === "withdraw" && (
                  <>
                    <Divider />
                    <tr>
                      <td>
                        <b>Ngân hàng: </b>
                      </td>
                      <td>{detail?.bank?.bank_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Số tài khoản: </b>
                      </td>
                      <td>{detail?.bank?.bank_number}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Chủ tài khoản: </b>
                      </td>
                      <td>{detail?.bank?.bank_owner}</td>
                    </tr>
                  </>
                )}
                <Divider />
                <tr>
                  <td>
                    <b>Số tiền: </b>
                  </td>
                  <td>
                    <b>{formatNumber(detail?.amount)}</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Ngày giao dịch: </b>
                  </td>
                  <td>
                    {formatDate(detail?.created_at, "DD/MM/YYYY HH:mm:ss")}
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Nội dung: </b>
                  </td>
                  <td>{detail?.content}</td>
                </tr>
              </tbody>
            </table>
          </Form.Item>
          <Form.Item name="reason" label="Lý do từ chối">
            <TextArea
              autoSize={{ minRows: 4 }}
              placeholder="Nhập lý do từ chối"
              readOnly={!isAdmin}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}
