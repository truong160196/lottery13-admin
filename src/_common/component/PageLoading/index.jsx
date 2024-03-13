import { observer } from "mobx-react-lite";
import React from "react";
import { useStores } from "_common/hooks";

import loading from "_common/styles/images/loading.gif";

const PageLoading = observer(() => {
  const { authStore } = useStores();

  return (
    <div className="page-loading">
      <div className="bg-inner" />
      <img src={authStore?.logo || loading} alt="logo" />
    </div>
  );
});

export default PageLoading;
