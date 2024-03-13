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
  Alert,
  Form,
  TextArea,
} from "remix-dls";
import { observer } from "mobx-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "states/api";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { statusColor, statusText } from "_common/constants/statusType";
import { usePermission } from "_common/hooks/usePermission";

const LuckyPage = observer(() => {
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
            <h2 className="remix-page-title">Rút thăm may mắn</h2>
          </div>
          <Alert
            message="Sau mỗi ngày hệ thống sẽ lấy ra 3 người trong danh sách email và nickname ở dưới để tiến hành trao giải. Càng nhiều email và nickname sàn càng uy tín!"
            type="info"
            className="mb-12"
          />
          <Card>
            <Form layout="vertical" className="form-cms">
              <Form.Item label="Danh sách email ngẫu nhiên">
                <TextArea
                  autoSize={{ minRows: 10 }}
                  placeholder="Mỗi email nằm trên 1 dòng"
                />
              </Form.Item>
              <Form.Item>
                <Button className="btn-secondary">Lưu danh sách email</Button>
              </Form.Item>
              <Form.Item label="Danh sách nickname ngẫu nhiên">
                <TextArea
                  autoSize={{ minRows: 10 }}
                  placeholder="Mỗi nickname nằm trên 1 dòng"
                />
              </Form.Item>
              <Form.Item>
                <Button className="btn-secondary">Lưu danh sách email</Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default LuckyPage;
