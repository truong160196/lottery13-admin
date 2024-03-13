import React from "react";
import { observer } from "mobx-react";
import ListLibrary from "pages/Profile/container/ListLibrary";
import { Card } from "remix-dls";

const LibraryPage = observer(() => {
  return (
    <>
      <div className="header-title-inner title">
        <div className="title">
          <h4>Thư viện ảnh</h4>
        </div>
      </div>
      <div className="main-layout-inner">
        <Card>
          <ListLibrary />
        </Card>
      </div>
    </>
  );
});

export default LibraryPage;
