import React, { useCallback, useEffect, useMemo } from "react";
import { get, Pagination } from "remix-dls";
import FIleItem from "_common/component/Attachment/FIleItem";

const ListLibrary = () => {
  const listFile = [
    {
      id: 17414,
      file_name: "Hợp đồng thiết kế website 2052.pdf",
      file_path:
        "assets/upload/document/1661387606_toi_khai_ten_mien_vuongphatvpvn.vn_page_1.pdf",
      description: null,
      file_type: "application/pdf",
      file_size: "329708",
      uploaded_by: 296,
      object_type: "project",
      object_id: 182,
      created_at: "2022-08-25T00:33:26.000000Z",
      updated_at: "2022-08-25T00:33:49.000000Z",
      file_url:
        "https://core.sem.net.vn/assets/upload/document/1661387606_toi_khai_ten_mien_vuongphatvpvn.vn_page_1.pdf",
      media_id: null,
      created_by: {
        id: 296,
        username: "sonnn",
        full_name: "Nguyễn Ngọc Sơn",
        avatar_url:
          "https://core.sem.net.vn/assets/upload/1665971215_anh-3x4.png",
      },
    },
    {
      id: 17413,
      file_name: "icon.png",
      file_path: "assets/upload/1661387095_icon.png",
      description: null,
      file_type: "image/png",
      file_size: "148425",
      uploaded_by: 296,
      object_type: "project",
      object_id: 182,
      created_at: "2022-08-25T00:24:55.000000Z",
      updated_at: "2022-08-25T00:24:55.000000Z",
      file_url: "https://core.sem.net.vn/assets/upload/1661387095_icon.png",
      media_id: null,
      created_by: {
        id: 296,
        username: "sonnn",
        full_name: "Nguyễn Ngọc Sơn",
        avatar_url:
          "https://core.sem.net.vn/assets/upload/1665971215_anh-3x4.png",
      },
    },
    {
      id: 17399,
      file_name: "Thông báo áp dụng chi phí tuyển KTS Quy hoạch.pdf",
      file_path:
        "assets/upload/document/1660795941_tb_ap_dung_chi_phi_tuyen_dung_kts_quy_hoach.pdf",
      description: null,
      file_type: "application/pdf",
      file_size: "675112",
      uploaded_by: 296,
      object_type: "project",
      object_id: 182,
      created_at: "2022-08-18T04:12:21.000000Z",
      updated_at: "2022-09-29T04:07:50.000000Z",
      file_url:
        "https://core.sem.net.vn/assets/upload/document/1660795941_tb_ap_dung_chi_phi_tuyen_dung_kts_quy_hoach.pdf",
      media_id: null,
      created_by: {
        id: 296,
        username: "sonnn",
        full_name: "Nguyễn Ngọc Sơn",
        avatar_url:
          "https://core.sem.net.vn/assets/upload/1665971215_anh-3x4.png",
      },
    },
  ];
  const metaData = {};
  const dataState = { loading: false };

  const getListAttachment = useCallback((params = {}) => {
    const requests = {
      params: {
        page: 1,
        limit: 10,
        object_id: 1,
        object_type: "order",
        ...params,
      },
    };
  }, []);

  useEffect(() => {
    getListAttachment();

    return () => {
      //
    };
  }, [getListAttachment]);

  const renderListFIle = useMemo(() => {
    return (
      <div className="list-file list-file-col">
        {listFile.map((item, idx) => {
          return (
            <FIleItem
              item={item}
              object_id={1}
              object_type="project"
              key={`item-file-${idx.toString()}`}
              control={{
                preview: true,
                download: true,
              }}
              show_info
            />
          );
        })}
      </div>
    );
  }, [listFile]);

  const handleChangePage = (next_page) => {
    getListAttachment({
      page: next_page || 1,
    });
  };

  return (
    <>
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
    </>
  );
};

export default ListLibrary;
