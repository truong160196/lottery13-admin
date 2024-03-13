import React from 'react';
import { InputNumber } from 'antd';

export default function FormattedInputNumber({
  disabled, placeholder, value, onChange,
}) {
  return (
    <InputNumber
      style={{ width: '100%' }}
      placeholder={placeholder}
      disabled={disabled}
      value={value}
      onChange={onChange}
      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
      parser={(value) => value.replace(/\$\s?|(\.*)/g, '')}
    />
  );
}
