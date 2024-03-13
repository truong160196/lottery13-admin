import React, { useEffect, useMemo, useState } from "react";
import { get, getQueryParams, Checkbox } from "remix-dls";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

export default function RequestCheckBox() {
  const naviate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const currentTab = params.get("tab");
  const transaction_type = params.get("transaction_type");

  const pathName = get(location, "pathname");
  const [checkedRequestKey, setCheckedRequest] = useState([
    "receive",
    "send",
    "follow",
  ]);

  useEffect(() => {
    if (!transaction_type) return;
    setCheckedRequest(transaction_type.split(","));
  }, [transaction_type]);

  const handleChangeRequest = (ev) => {
    const urlString = createSearchParams({
      transaction_type: ev.join(",") || "none",
      tab: currentTab,
    });
    setCheckedRequest(ev);
    naviate({
      pathname: pathName,
      search: urlString.toString(),
    });
  };

  return (
    <Checkbox.Group
      className="menu-left-checkbox"
      value={checkedRequestKey}
      onChange={handleChangeRequest}
    >
      <Checkbox value="receive">Gửi đến tôi</Checkbox>
      <Checkbox value="send">Tôi gửi đi</Checkbox>
      <Checkbox value="follow">Đang theo dõi</Checkbox>
    </Checkbox.Group>
  );
}
