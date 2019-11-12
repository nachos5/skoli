import React from 'react';

export default function Spinner(props) { // eslint-disable-line
  return (    
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}