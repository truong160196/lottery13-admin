import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  formatDate,
  get,
  GridView,
  Popconfirm,
  message,
  Empty,
  Tag,
  formatNumber,
  Menu,
  Input,
  getQueryParams,
  updateQueryParams,
  Form,
  InputNumber,
  Row,
  Col,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import { useLocation, useNavigate } from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";

const CommissionPage = observer(() => {
  const { isAdmin } = usePermission();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = useMemo(() => getQueryParams(location?.search) || {}, [
    location,
  ]);

  const [listChecked, setCheckData] = useState([]);

  const { mutate: onDelete, isLoading: deleteLoading } = useMutation(
    (id) => {
      return UserApi.delete({ id });
    },
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["user", "list"]);
        message.success(res?.data?.msg || "Thao tác thành công");
      },
      onError: (error) => {
        const errorMessage = error?.message ?? "Vui lòng thử lại!";
        message.error(errorMessage);
      },
    }
  );

  if (!isAdmin)
    return (
      <div className="remix-page">
        <Empty description="Không có quyền truy cấp" />
      </div>
    );

  return (
    <div className="remix-page">
      <div className="main-content-inner">
        <div className="page-container">
          <div className="remix-sub-header">
            <h2 className="remix-page-title">Hoa hồng</h2>
          </div>

          <Card>
            <Row>
              <Col xs={24} md={12}>
                <Form layout="vertical" className="form-cms">
                  <Form.Item>
                    <Button className="btn-secondary">Thêm cấp</Button>
                  </Form.Item>
                  <Form.Item label="% Cấp 1">
                    <Input.Group compact>
                      <InputNumber
                        style={{ width: "90%" }}
                        placeholder="Nhập % hoa hồng"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                      />
                      <Button>x</Button>
                    </Input.Group>
                    <p className="mb-0">
                      <b>$ 10 = 0</b>
                    </p>
                  </Form.Item>
                  <Form.Item label="% Cấp 2">
                    <Input.Group compact>
                      <InputNumber
                        style={{ width: "90%" }}
                        placeholder="Nhập % hoa hồng"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                      />
                      <Button>x</Button>
                    </Input.Group>
                    <p className="mb-0">
                      <b>$ 10 = {formatNumber(0.001245)}</b>
                    </p>
                  </Form.Item>
                  <Form.Item label="% Cấp 3">
                    <Input.Group compact>
                      <InputNumber
                        style={{ width: "90%" }}
                        placeholder="Nhập % hoa hồng"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                        }
                        parser={(value) => value.replace(/\$\s?|(\.*)/g, "")}
                      />
                      <Button>x</Button>
                    </Input.Group>
                    <p className="mb-0">
                      <b>$ 10 = 0</b>
                    </p>
                  </Form.Item>
                  <Form.Item>
                    <Button className="btn-primary">Lưu thay đổi</Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default CommissionPage;
