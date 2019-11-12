import React from 'react';
import PropTypes from 'prop-types';

export default function Errors(props) {
  const { errors } = props;
  
  if (errors) {
    return (
      <div>
        {errors.map((err, i) => {
          return <p key={i}>
                  {err.field} - {err.message}
                </p>
        })}
      </div>
    );
  }
  
  return null;
}

Errors.propTypes = {
  errors: PropTypes.array,
};
