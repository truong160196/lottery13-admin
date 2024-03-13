import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import classNames from "classnames";

export default function Account({
  image_url = "",
  full_name = null,
  image = null,
  sub_title = null,
  username = null,
  type_approve = null,
  className = "",
}) {
  return (
    <span className={classNames("account", className)}>
      {image ? (
        <img className="img-self" src={image_url} alt="" />
      ) : (
        <FontAwesomeIcon icon={faUser} />
      )}
      <p>
        <b className="full_name xdot">{full_name}</b>
        {(sub_title || username) && (
          <p>
            {username && <b className="username text-lowercase">@{username}</b>}
            {sub_title && <span>{sub_title}</span>}
            {type_approve && (
              <span className="type-approve text-success text-lowercase">
                {type_approve}
              </span>
            )}
          </p>
        )}
      </p>
    </span>
  );
}
