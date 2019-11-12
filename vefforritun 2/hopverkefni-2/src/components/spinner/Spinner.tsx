import React from 'react';

// ./
import './Spinner.scss';

export default function Spinner() {
  return (
    <div className="spinner-border m-auto" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}