import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Empty, Form, get, Input, Modal, Skeleton, Spin } from "remix-dls";
import { AttachmentApi } from "states/api/attachment";
import { checkFileType } from "_common/utils/FileHelper";

const ModalPreview = ({
  visible,
  id = null,
  file_name = null,
  file_url = null,
  type = "other",
  onCLose,
}) => {
  const [form] = Form.useForm();
  const [dataFile, setDataFile] = useState();
  const [file_type, setFileType] = useState(type);
  const [dataDetail, setDataDetail] = useState();

  const { data, isLoading: loading } = useQuery(
    ["attachment", "detail", id],
    () =>
      AttachmentApi.getDetail({
        id,
      }),
    {
      staleTime: 300000,
      enabled: !!id,
    }
  );

  const handleClose = () => {
    onCLose();
    form.resetFields();
  };

  useEffect(() => {
    if (!data) return;
    const type = checkFileType(data?.detail?.file_name);
    setFileType(type);
    setDataDetail(data?.detail);
    setDataFile(data?.src);
  }, [data]);

  const renderLayout = () => {
    if (loading) return <Skeleton />;
    if (!file_url && !get(dataDetail, "file_url", ""))
      return <Empty description="Không thể tải file hiện thị" />;
    switch (file_type) {
      case "image":
        return (
          <img
            src={dataFile}
            alt={file_name || get(dataDetail, "file_name", "")}
          />
        );
      case "pdf":
        return (
          <object
            title={file_name || get(dataDetail, "file_name", "")}
            data={`${file_url ||
              get(dataDetail, "file_url", "")}#page=1&zoom=85`}
            type="application/pdf"
          >
            <Empty description="Không thể tải file hiện thị" />
          </object>
        );

      default:
        return <Empty description="Không thể tải file hiện thị" />;
    }
  };

  return (
    <>
      <Modal
        className="remix-modal-preview"
        visible={visible}
        onCancel={handleClose}
        maskClosable={false}
        footer={false}
      >
        <Spin tip="Loading ..." spinning={loading}>
          <div className="preview-container">{renderLayout()}</div>
        </Spin>
      </Modal>
    </>
  );
};

export default ModalPreview;
