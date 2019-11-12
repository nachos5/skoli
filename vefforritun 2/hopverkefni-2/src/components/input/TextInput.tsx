import React from 'react';

// ./
import './Input.scss';

interface Props {
  className?: string,
}

export default function Input(props: Props) {
  const { className } = props;

  return (
    <input
      id="input"
      className={className ? className : ''}
      minLength={3}
      required={true} />
  );
}