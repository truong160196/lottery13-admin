import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Button,
  Spin,
  Form,
  Modal,
  message,
  Divider,
  Empty,
  Table,
  get,
  Collapse,
  Row,
  Col,
  Pagination,
} from "remix-dls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRefApi } from "states/api/user_ref";

import FormData from "./FormData";
import Filter from "./Filter";

export default function ListRefUser({
  visible,
  onClose,
  onRefreshData,
  detail,
  requests,
}) {
  const queryClient = useQueryClient();
  const [params, setParams] = useState({});
  const user_id = detail?.id;

  const { data, isLoading, refetch } = useQuery(
    ["user_ref", "list", user_id, params],
    () =>
      UserRefApi.getList({
        params: {
          page: 1,
          limit: 10,
          user_id,
          ...params,
        },
      }),
    {
      staleTime: 300000,
      enabled: !!user_id,
    }
  );

  const handleCancel = () => {
    onClose(false);
  };

  const Body = () => {
    if (!data?.data?.length)
      return <Empty description="Không có dữ liệu tuyến dưới" />;
    return (
      <>
        <Collapse>
          {data?.data?.map((item) => {
            return (
              <Collapse.Panel
                header={
                  <Row style={{ width: "100%" }}>
                    <Col xs={24} sm={6}>
                      <p>
                        <span>ID:</span>
                      </p>
                      <p>
                        <p>{item?.created_by?.id}</p>
                      </p>
                    </Col>
                    <Col xs={24} sm={6}>
                      <p>
                        <span>Tài khoản:</span>
                      </p>
                      <p>{item?.created_by?.username}</p>
                    </Col>
                    <Col xs={24} sm={6}>
                      <p>
                        <span>Tên người dùng:</span>
                      </p>
                      <p>{item?.created_by?.full_name}</p>
                    </Col>
                    <Col xs={24} sm={6}>
                      <p>
                        <span>Mã giới thiệu:</span>
                      </p>
                      <p>{item?.created_by?.ref_no}</p>
                    </Col>
                  </Row>
                }
                key={item?.created_by?.id}
              >
                <table className="table-info">
                  <tbody>
                    <tr>
                      <td>
                        <p>
                          <span>ID</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.id}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Tên đầy đủ</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.full_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Biệt danh</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.nick_name}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Mã giới thiệu</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.ref_no}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Email</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Số điện thoại</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.phone}</td>
                    </tr>
                    <tr>
                      <td>
                        <p>
                          <span>Link CSKH</span>
                        </p>
                      </td>
                      <td>{item?.created_by?.link_zalo}</td>
                    </tr>
                  </tbody>
                </table>
              </Collapse.Panel>
            );
          })}
        </Collapse>
        {Number(get(data, "total", 0)) > 10 && (
          <Pagination
            current={parseInt(get(data, "current_page"), 10) || 1}
            pageSize={parseInt(get(data, "per_page"), 10) || 10}
            total={get(data, "total")}
            onChange={(page, pageSize) => {
              setParams({
                ...params,
                page,
                limit: pageSize,
              });
            }}
          />
        )}
      </>
    );
  };

  return (
    <Modal
      className="remix-modal-form ref-modal"
      visible={visible}
      title="Danh sách thành viên"
      onCancel={() => handleCancel()}
      maskClosable={false}
      width="60%"
      footer={[
        <>
          <Button className="btn-default" onClick={() => handleCancel()}>
            Đóng
          </Button>
        </>,
      ]}
    >
      <Spin tip="Loading" spinning={isLoading}>
        <div className="remix-page">
          <div className="remix-filter">
            <Filter params={params} setParams={setParams} />
          </div>
        </div>

        <Body />
      </Spin>
    </Modal>
  );
}
