import React from "react";

import { UploadCustom } from "remix-dls";
import { endpoint } from "_common/constants/common";

export default function Upload({ ...props }) {
  return (
    <div className="upload-custom">
      <UploadCustom endpoint={endpoint} {...props} />
    </div>
  );
}
