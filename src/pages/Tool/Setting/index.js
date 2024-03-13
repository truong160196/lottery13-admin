import React from "react";
import { Card, Empty } from "remix-dls";
import { observer } from "mobx-react";
import { usePermission } from "_common/hooks/usePermission";
import FormData from "./FormData";

const SettingPage = observer(() => {
  const { isAdmin } = usePermission();

  if (!isAdmin)
    return (
      <div className="remix-page">
        <Empty description="Không có quyền truy cấp" />
      </div>
    );

  return (
    <div className="remix-page">
      <div className="remix-sub-header">
        <h2 className="remix-page-title">Cài đặt</h2>
      </div>
      <Card>
        <FormData />
      </Card>
    </div>
  );
});

export default SettingPage;
