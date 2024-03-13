import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "remix-dls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";

import ModalSearch from "./ModalSearch";
import ListComment from "./ListComment";

export const listFIle = [
  {
    created_at: "22/06/2022",
    created_by: "Hoàng Nguyễn",
    message:
      "Cấu hình: Laptop Dell Gaming G15 5515 (P105F004DGR) (R5 5600H/16GB RAM/ 512GB SSD/RTX3050 4G/15.6 inch FHD 120Hz/ Win11/OfficeHS21/Xám) (2021)",
    image_url: "http://localhost:8081/assets/upload/user1.jpg",
    count_comment: 10,
    count_like: 1,
  },
  {
    created_at: "19/06/2022",
    created_by: "Trường Nguyễn",
    message:
      "approved the request NGUYỄN NGỌC SƠN-PHÒNG THIẾT KẾ-ĐỀ NGHỊ MUA LAPTOP",
    file_type: "pdf",
    image_url: "http://localhost:8081/assets/upload/user2.jpg",
    count_comment: 2,
    count_like: 4,
  },
  {
    created_at: "19/06/2022",
    created_by: "Hoàng Tuấn",
    message: "Dữ liệu báo cáo hàng tháng quý 5.docx",
    image_url: "http://localhost:8081/assets/upload/user3.jpg",
    count_comment: 0,
    count_like: 1,
  },
  {
    created_at: "13/06/2022",
    message:
      "created a request NGUYỄN NGỌC SƠN-PHÒNG THIẾT KẾ-ĐỀ NGHỊ MUA LAPTOP",
    created_by: "Quân AV",
    image_url: "http://localhost:8081/assets/upload/user4.jpg",
    count_comment: 320,
    count_like: 960,
  },
];

export default function Comment({ onClose, object_type, object_id }) {
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <div className="right-bar-body">
      <div className="right-bar-header">
        <h4>Thảo luận</h4>
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
        <ListComment object_type={object_type} object_id={object_id} />
      </div>
      <ModalSearch visible={openSearch} onCLose={() => setOpenSearch(false)} />
    </div>
  );
}
