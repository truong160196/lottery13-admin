import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";

import UploadFile from "_common/component/UploadFile";

export default function UploadAttachment({
  object_id,
  object_type = "",
  description = "",
  onReceive,
  className,
  children,
  ...props
}) {
  const [images, setListImages] = useState([]);

  const handleReceiveImages = (images) => {
    setListImages(images);
    if (typeof onReceive === "function" && images?.length > 0) {
      onReceive({
        icon_image: images.map((obj) => ({
          id: obj?.id,
          url: obj?.url,
          name: obj?.name,
        }))[0],
      });
    }
  };

  return (
    <UploadFile
      object_id={object_id}
      object_key={object_type}
      description={description}
      fileList={images}
      onReceiveImages={handleReceiveImages}
      className={classNames(className)}
      {...props}
    >
      {children}
    </UploadFile>
  );
}
