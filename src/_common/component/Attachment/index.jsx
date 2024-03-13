import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  Button,
  Empty,
  get,
  groupBy,
  message,
  Pagination,
  Spin,
} from "remix-dls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSearch,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { useConfig } from "_common/hooks/context";
import { getControl, getControlByValue } from "_common/helper";

// redux
import AttachmentSelectors from "pages/Common/_redux/selectors/attachment";
import AttachmentActions from "pages/Common/_redux/actions/attachment";

import FIleItem from "./FIleItem";
import ModalSearch from "./ModalSearch";
import UploadAttachment from "./UploadAttachment";

export default function Attachment({ onClose, object_type, object_id }) {
  const dispatch = useDispatch();
  const listData = useSelector(AttachmentSelectors.getList);
  const metaData = useSelector(AttachmentSelectors.getMetadata);
  const dataState = useSelector(AttachmentSelectors.getState);
  const dataContext = useConfig();

  const [openSearch, setOpenSearch] = useState(false);

  const controls = get(dataContext, "controls", []);
  const permission = get(dataContext, "permission", false);

  const lstButton = useMemo(() => {
    const upload = getControlByValue(controls, "attachment_upload", permission);
    const rename = getControlByValue(controls, "attachment_rename", permission);
    const remove = getControlByValue(controls, "attachment_delete", permission);
    const download = getControlByValue(
      controls,
      "attachment_download",
      permission
    );
    const preview = getControlByValue(
      controls,
      "attachment_preview",
      permission
    );

    return {
      upload,
      rename,
      remove,
      download,
      preview,
    };
  }, [controls]);

  const getListAttachment = (params = {}) => {
    if (!object_id) return;
    dispatch(
      AttachmentActions.onGetList({
        params: {
          page: 1,
          limit: 10,
          object_id,
          object_type,
          ...params,
        },
      })
    );
  };

  useEffect(() => {
    getListAttachment();

    return () => {
      dispatch(AttachmentActions.onClearState());
    };
  }, [object_id]);

  const handleChangePage = (next_page) => {
    getListAttachment({
      page: next_page || 1,
    });
  };

  const renderListFIle = useMemo(() => {
    if (!listData?.length && !dataState?.loading)
      return <Empty description="Không có dữ liệu" />;

    const formatData = listData.map((obj) => ({
      ...obj,
      date: moment(obj?.created_at).format("DD/MM/YYYY"),
    }));

    const groupData = groupBy(formatData, "date");

    return (
      <>
        {Object.keys(groupData).map((key, index) => {
          const listFile = groupData[key] || [];
          return (
            <div key={`item-${index.toString()}`}>
              <div className="timeline">
                <span>{key}</span>
              </div>
              <div className="list-file">
                {listFile.map((item, idx) => {
                  return (
                    <FIleItem
                      item={item}
                      object_id={object_id}
                      object_type={object_type}
                      key={`item-file-${idx.toString()}`}
                      control={lstButton}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
  }, [listData]);

  const handleReceiveFile = (data) => {
    if (data?.icon_image) {
      message.success("Tải file lên thành công");
      getListAttachment();
    }
  };

  return (
    <div className="right-bar-body">
      <div className="right-bar-header">
        <h4>Tệp đính kèm</h4>
        <div className="control">
          <Button>
            <FontAwesomeIcon
              onClick={() => setOpenSearch(true)}
              icon={faSearch}
            />
          </Button>
          <Button onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      </div>
      <div className="content">
        <Spin tip="Đang tải ..." spinning={dataState?.loading}>
          {(lstButton.upload || permission) && (
            <UploadAttachment
              object_id={object_id}
              onReceive={handleReceiveFile}
              className="btn-upload-container"
              showUploadList={false}
            >
              <Button className="btn-full-width btn-outline-bar">
                <FontAwesomeIcon icon={faPaperclip} />
                <span>{get(lstButton, "upload.label", "Tải lên")}</span>
              </Button>
            </UploadAttachment>
          )}

          {renderListFIle}
          {get(metaData, "total", 0) > get(metaData, "per_page", 10) && (
            <div className="pagination-container">
              <Pagination
                total={get(metaData, "total")}
                current={get(metaData, "current_page")}
                onChange={handleChangePage}
              />
            </div>
          )}
        </Spin>
      </div>
      <ModalSearch visible={openSearch} onCLose={() => setOpenSearch(false)} />
    </div>
  );
}
