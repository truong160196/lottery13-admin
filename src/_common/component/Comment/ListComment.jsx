import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Button,
  Drawer,
  Form,
  get,
  getQueryParams,
  Pagination,
  Spin,
  TextArea,
  Upload,
} from "remix-dls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentApi } from "states/api";
import { useStores } from "_common/hooks";

import Item from "./Item";
import FormData from "./FormData";

export default function ListComment({
  object_type,
  object_id,
  timeUpdate = null,
}) {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const { data: dataState, isLoading } = useQuery(
    ["comment", "list", object_id, currentPage],
    () =>
      CommentApi.getList({
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

  const listData = get(dataState, "data.data", []);
  const metaData = get(dataState, "data", {});

  const handleChangePage = (next_page) => {
    setCurrentPage(next_page);
  };

  const getListComment = () => {
    queryClient.invalidateQueries(["comment", "list", object_id, 1]);
  };

  const renderListFIle = useMemo(() => {
    return (
      <>
        <div className="list-file">
          {listData.map((item, idx) => {
            return (
              <Item
                object_id={object_id}
                object_type={object_type}
                item={item}
                key={`item-file-${idx.toString()}`}
                onGetList={getListComment}
              />
            );
          })}
        </div>
      </>
    );
  }, [listData]);

  return (
    <div className="comment-container">
      <Spin tip="loading..." spinning={isLoading}>
        <FormData
          onGetList={getListComment}
          object_id={object_id}
          object_type={object_type}
        />
        {renderListFIle}
        {get(metaData, "total") > 10 && (
          <div className="pagination-container">
            <Pagination
              total={get(metaData, "total")}
              current={get(metaData, "current_page")}
              onChange={handleChangePage}
            />
          </div>
        )}
      </Spin>
    </div>
  );
}
