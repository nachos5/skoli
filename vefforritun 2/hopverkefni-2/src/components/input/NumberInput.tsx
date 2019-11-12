import React from 'react';

// ./
import './Input.scss';

interface Props {
  defaultValue?: number,
}

export default function Input(props: Props) {
  const { defaultValue } = props;

  return (
    <input
      id="input"
      className="p-1 w-100"
      type='number'
      defaultValue={defaultValue ? defaultValue.toString() : '1'}
      min='1'
      required={true} />
  );
}