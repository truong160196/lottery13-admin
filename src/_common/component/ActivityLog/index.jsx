import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { Empty, get, groupBy, Pagination, Spin } from "remix-dls";
import { ActivityLogApi } from "states/api/activityLog";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// redux
import ActivityLogItem from "./Item";

export default function ActivityLog({ onClose, object_type, object_id }) {
  const queryClient = useQueryClient();
  const metaData = {};

  const [currentPage, setCurrentPage] = useState(1);

  const { data: dataState, isLoading } = useQuery(
    ["activityLog", "list", object_id, currentPage],
    () =>
      ActivityLogApi.getList({
        params: {
          page: currentPage || 1,
          limit: 10,
          object_type,
          object_id,
        },
      }),
    {
      staleTime: 300000,
      enabled: !!object_id,
    }
  );

  const listData = get(dataState, "data", []);

  const handleChangePage = (next_page) => {
    setCurrentPage(next_page);
  };

  const renderListData = useMemo(() => {
    try {
      if (!listData?.length) return <Empty description="Không có dữ liệu" />;

      const formatData = listData.map((obj) => ({
        ...obj,
        date: moment(obj?.created_at).format("DD/MM/YYYY"),
      }));

      const groupData = groupBy(formatData, "date");

      return (
        <>
          {Object.keys(groupData).map((key, index) => {
            const listFile = groupData[key] || [];
            return (
              <div key={`item-${index.toString()}`}>
                <div className="timeline">
                  <span>{key}</span>
                </div>
                <div className="list-file">
                  {listFile.map((item, idx) => {
                    return (
                      <ActivityLogItem
                        item={item}
                        key={`item-file-${idx.toString()}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      );
    } catch (err) {
      console.error(err);
      return <></>;
    }
  }, [listData]);

  return (
    <>
      <Spin tip="Đang tải ..." spinning={isLoading}>
        {renderListData}
        {get(metaData, "total", 0) > get(metaData, "per_page", 10) && (
          <div className="pagination-container">
            <Pagination
              total={get(metaData, "total")}
              current={get(metaData, "current_page")}
              onChange={handleChangePage}
            />
          </div>
        )}
      </Spin>
    </>
  );
}
