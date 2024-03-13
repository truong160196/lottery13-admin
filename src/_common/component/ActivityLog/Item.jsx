import React, { useMemo } from "react";
import classNames from "classnames";
import { formatDate, get } from "remix-dls";

export default function Item({ item }) {
  const noteData = get(item, "note", "");

  const renderNoteF = useMemo(() => {
    if (!noteData) return <></>;
    const splitData = noteData.split(";");

    if (splitData?.length > 0) {
      return splitData.map((obj, index) => {
        if (!obj) return <></>;
        return <li key={`item-${index.toString()}`}>{obj}</li>;
      });
    }

    return <></>;
  }, [noteData]);

  return (
    <div className={classNames("item log-item")}>
      <li className="log">
        <b className="time-title">{formatDate(item.created_at, "HH:mm")} </b>
        <div className="log-content">
          <b className="text-success">{item?.created_by?.full_name}</b>
          <span className="text-lowercase">{item?.action_type_text}</span>
          <span className="text-lowercase">{item?.type_text}</span>
          <b>{item?.content}</b>
          {noteData?.length > 0 && <ul>{renderNoteF}</ul>}
        </div>
      </li>
    </div>
  );
}
