import React from "react";

import { Result } from "remix-dls";

export default function CardPermission() {
  return (
    <Result
      status="warning"
      title="Không có quyền truy cập"
      subTitle="Vui lòng liên hệ admin để sử dụng tính năng này"
    />
  );
}
