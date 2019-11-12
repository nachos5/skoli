import React from 'react';
// @ts-ignore
import { DelayInput } from 'react-delay-input';

// ./
import './Input.scss';

interface Props {
  callback: any,
}

export default function Input(props: Props) {
  const { callback } = props;
  
  return (
    <DelayInput
      id="input"
      className="input pl-2 mb-5 w-100"
      minLength={2}
      delayTimeout={500}
      onChange={(e: any) => callback(e.target.value)}
      placeholder="Leitaðu að vörum..." />
  );
}