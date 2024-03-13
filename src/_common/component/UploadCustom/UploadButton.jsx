import React from "react";
import { Button, Upload } from "remix-dls";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraAlt } from "@fortawesome/free-solid-svg-icons";

import classnames from "classnames";

const UploadButtonUI = ({ textDisplay, imgSrc }) => (
  <div className="item-file">
    {imgSrc ? (
      <img src={imgSrc} alt={textDisplay} />
    ) : (
      <>
        <FontAwesomeIcon icon={faCameraAlt} />
        <p>{textDisplay}</p>
      </>
    )}
  </div>
);

const UploadButton = ({
  fileList = [],
  onPreview,
  listType = "picture-card",
  onChange,
  maxImages,
  onUpload,
  disabled,
  onRemove,
  typeUpload,
  textDisplay,
  imgSrc,
}) => {
  const _renderUploadButton = () => {
    if (listType === "picture-card")
      return <UploadButtonUI textDisplay={textDisplay} imgSrc={imgSrc} />;
    return (
      <Button>
        <UploadOutlined />
      </Button>
    );
  };

  return (
    <Upload
      className={classnames({
        avatar:
          maxImages !== undefined &&
          maxImages === fileList?.length &&
          typeUpload === "avatar",
      })}
      disabled={disabled}
      name="image"
      customRequest={onUpload}
      // @ts-ignore
      listType={listType}
      fileList={maxImages > 1 ? fileList : []}
      onPreview={onPreview}
      onChange={onChange}
      onRemove={onRemove}
      maxCount={maxImages}
    >
      {!disabled && _renderUploadButton()}
    </Upload>
  );
};

export default UploadButton;
