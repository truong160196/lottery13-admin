import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState, useEffect } from "react";

import { debounce, get, Select } from "remix-dls";
import { CustomerApi } from "states/api";

export default function SelectCustomer({
  defaultValue = null,
  onUpdateData = (value) => {},
  defaultParam = {},
  ...props
}) {
  const [listOptions, setListOption] = useState([]);
  const [params, setParams] = useState({});

  const { data: dataState, isLoading } = useQuery(
    ["customer", "list", params],
    () =>
      CustomerApi.getList({
        params: {
          page: 1,
          limit: 10,
          ...params,
        },
      }),
    {
      staleTime: 300000,
    }
  );

  const getDebounceData = debounce((params) => {
    setParams(params);
  }, 500);

  useEffect(() => {
    if (Array.isArray(dataState?.data)) {
      setListOption(dataState?.data);
    }
  }, [dataState?.data]);

  const options = useMemo(() => {
    let cloneData = [...listOptions];

    if (defaultValue?.value) {
      const checkExits = listOptions.findIndex(
        (obj) => obj.value === defaultValue?.value
      );
      if (checkExits === -1) {
        cloneData = [...listOptions, { ...defaultValue }];
      }
    }

    if (Array.isArray(defaultValue) && defaultValue?.length > 0) {
      defaultValue.forEach((item) => {
        const checkExits = listOptions.findIndex((obj) => obj.id === item?.id);
        if (checkExits === -1) {
          cloneData.push(item);
        }
      });
    }

    return cloneData.map((obj, idx) => (
      <Select.Option
        key={`option-${idx.toString()}`}
        value={obj?.id}
        label={obj?.name}
      >
        {obj.name}
      </Select.Option>
    ));
  }, [listOptions]);

  const handleSearch = (newValue) => {
    if (newValue) {
      getDebounceData({
        keyword: newValue,
      });
    } else {
      getDebounceData({ page: 1, limit: 10 });
    }
  };

  const handleChange = (newValue) => {
    const item = listOptions.find((obj) => obj.id === newValue);
    onUpdateData(item);
  };

  return (
    <Select
      showSearch
      defaultActiveFirstOption={false}
      filterOption={false}
      onSearch={handleSearch}
      onSelect={handleChange}
      {...props}
    >
      {options}
    </Select>
  );
}
